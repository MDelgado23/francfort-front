"use client";
import React, { useEffect, useState } from "react";
import "./participacionEmp.css";
import { GraphsComponent } from "@/app/components/GraphsComponent/GraphsComponent";
import clienteAxios, { baseURL } from "@/app/services/axiosInstance";
import { useTranslation } from "react-i18next";

interface DataItem {
  empresa: string;
  participacion: number;
  tipo: string;
}

interface EmpresaData {
  codEmpresa: string;
  nombreEmpresa: string;
}

const fetchData = async (): Promise<{
  cotizaciones: DataItem[];
  empresas: EmpresaData[];
}> => {
  const [cotizacionesRes, empresasRes] = await Promise.all([
    clienteAxios.get(`${baseURL}/cotizaciones/participacionBolsa`),
    clienteAxios.get(`${baseURL}/empresas/buscar/db`),
  ]);

  return {
    cotizaciones: cotizacionesRes.data,
    empresas: empresasRes.data,
  };
};

const transformData = (
  cotizaciones: DataItem[],
  empresas: EmpresaData[]
): DataItem[] => {
  const empresaMap = empresas.reduce<Record<string, string>>((map, empresa) => {
    map[empresa.codEmpresa] = empresa.nombreEmpresa;
    return map;
  }, {});

  return cotizaciones.map((item) => ({
    ...item,
    empresa: empresaMap[item.empresa] || item.empresa,
  }));
};

const filterAndTransform = (
  data: DataItem[],
  tipo: string
): [string, number][] =>
  data
    .filter((item) => item.tipo === tipo)
    .map((item) => [item.empresa, item.participacion]);

const ParticipacionEmpPage: React.FC = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<[string, number][]>([]);
  const [selectedType, setSelectedType] = useState<"DIA" | "MES">("DIA");
  const [allData, setAllData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const { cotizaciones, empresas } = await fetchData();
        const transformedData = transformData(cotizaciones, empresas);
        setAllData(transformedData);
        setChartData(filterAndTransform(transformedData, selectedType));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      setChartData(filterAndTransform(allData, selectedType));
    }
  }, [selectedType, allData]);

  return (
    <div className="graficos-page">
      <div className="graficoContainer">
        <h1>{t("chart.title2")}</h1>
        {loading ? (
          <div className="loading-container">
            <p>{t("loading")}</p>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <GraphsComponent data={chartData} selectedType={selectedType} />
            <div className="button-group">
              <button
                className={`btn ${
                  selectedType === "DIA" ? "btn-active" : "btn-inactive"
                }`}
                onClick={() => setSelectedType("DIA")}
              >
                {t("chart.type.DIA")}
              </button>
              <button
                className={`btn ${
                  selectedType === "MES" ? "btn-active" : "btn-inactive"
                }`}
                onClick={() => setSelectedType("MES")}
              >
                {t("chart.type.MES")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipacionEmpPage;
