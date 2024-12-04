"use client";

import React, { useEffect, useState } from "react";
import "./CardsCot.css";
import clienteAxios, { baseURL } from "@/app/services/axiosInstance";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useTranslation } from "react-i18next";

interface ICotizacionCard {
  codEmpresa: string;
  nombreEmpresa: string;
  valorActual: number;
  fluctuacion: number;
}

interface CardsProps {
  codEmpresa: string;
  onViewChart: () => void; 
}

export const CardsCot: React.FC<CardsProps> = ({
  codEmpresa,
  onViewChart,
}) => {
  const { t } = useTranslation();
  const [cotizacion, setCotizacion] = useState<ICotizacionCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await clienteAxios.get<ICotizacionCard>(
          `${baseURL}/cotizaciones/lastCotizacionEmpByCod/${codEmpresa}`
        );

        setCotizacion(response.data);
      } catch (err) {
        setError("Hubo un problema al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codEmpresa]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  if (!cotizacion) return <p>{t("noData")}</p>;

  const { nombreEmpresa, valorActual, fluctuacion } = cotizacion;

  return (
    <div className="cardCotizacion horizontal">
      <div className="empresa-info">
        <p className="codigo">{codEmpresa}</p>
        <p className="nombre">{nombreEmpresa}</p>
      </div>
      <div className="valor-info">
        <p className="valor">${valorActual}</p>
        <p
          className={`porcentaje ${
            fluctuacion > 0 ? "positivo" : fluctuacion < 0 ? "negativo" : "neutro"
          }`}
        >
          {fluctuacion.toFixed(2)}%
        </p>
      </div>
      <div className="acciones">
        <button className="btn-grafico" onClick={onViewChart}>
          {t("viewChart")}
        </button>
      </div>
    </div>
  );
};
