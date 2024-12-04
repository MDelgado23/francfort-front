"use client";

import React, { useEffect, useState } from "react";
import { LineasIndices } from "@/app/components/LineasIndices/LineasIndices";
import clienteAxios, { baseURL } from "@/app/services/axiosInstance";
import { useTranslation } from "react-i18next";
import "./cotIndices.css";
import { toZonedTime } from "date-fns-tz";

const IndicesPage: React.FC = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const processData = (data: any[], codIndice: string) => {
    return data
      .filter((cotizacion: any) => {
        const fechaHora = `${cotizacion.fecha}T${cotizacion.hora}:00Z`; // UTC
        return (
          !isNaN(new Date(fechaHora).getTime()) &&
          !isNaN(parseFloat(cotizacion.valorCotizacionIndice))
        );
      })
      .map((cotizacion: any) => {
        const datetime = new Date(
          `${cotizacion.fecha}T${cotizacion.hora}:00Z`
        );
        const zonedDate = toZonedTime(new Date(datetime), "Europe/Berlin");
        return {
          x: zonedDate.toISOString(),
          y: parseFloat(cotizacion.valorCotizacionIndice),
        };
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: codsIndice } = await clienteAxios.get(
          `${baseURL}/indice/getAllCods`
        );

        if (!Array.isArray(codsIndice)) {
          throw new Error(t("error.invalidCodsIndiceFormat"));
        }

        const cotizacionesPromises = codsIndice.map((codIndice: string) =>
          clienteAxios.get(
            `${baseURL}/indice-cotizacion/getAllIndCotByCod/${codIndice}`
          )
        );

        const cotizacionesResponses = await Promise.all(cotizacionesPromises);
        const formattedData = cotizacionesResponses.map((response, index) => {
          const codIndice = codsIndice[index];
          const validData = processData(response.data, codIndice);

          return {
            name: codIndice,
            data: validData,
          };
        });

        setChartData(formattedData);
      } catch (error) {
        console.error(t("error.fetchingData"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  return (
    <div>
      <div className="indices-container">
        <h1>{t("chart.title3")}</h1>
        {loading ? (
          <p className="loading-message">{t("loading")}</p>
        ) : (
          <LineasIndices data={chartData} />
        )}
      </div>
    </div>
  );
};

export default IndicesPage;
