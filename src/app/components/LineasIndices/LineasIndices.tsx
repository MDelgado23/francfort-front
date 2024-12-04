"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import "./LineasIndices.css";

interface LineasProps {
  data: { name: string; data: { x: string; y: number }[] }[];
}

const filterDataByRange = (
  data: { x: string; y: number }[],
  range: "1d" | "3d" | "1w" | "1m" | "all"
): { x: string; y: number }[] => {
  if (range === "all") return data;

  const now = new Date();
  const rangesInDays: Record<"1d" | "3d" | "1w" | "1m", number> = {
    "1d": 1,
    "3d": 3,
    "1w": 7,
    "1m": 30,
  };

  const days = rangesInDays[range];
  return data.filter((item) => {
    const itemDate = new Date(item.x);
    return now.getTime() - itemDate.getTime() <= days * 24 * 60 * 60 * 1000;
  });
};

export const LineasIndices: React.FC<LineasProps> = ({ data }) => {
  const [range, setRange] = useState<"1d" | "3d" | "1w" | "1m" | "all">("1d");
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
  const [conversionRate, setConversionRate] = useState<number>(1);

  const { t } = useTranslation();

  const fetchConversionRate = async () => {
    try {
      const rate = 0.85;
      setConversionRate(rate);
    } catch (err) {
      console.error("Error al obtener la tasa de conversión:", err);
      setConversionRate(1);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, []);

  const processedSeries = useMemo(() => {
    return data.map((serie) => ({
      name: serie.name,
      data: filterDataByRange(serie.data, range).map((point) => ({
        x: point.x,
        y: currency === "EUR" ? point.y * conversionRate : point.y,
      })),
    }));
  }, [data, range, currency, conversionRate]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: true },
      background: "#1e1e2f",
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "yyyy-MM-dd HH:mm",
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      title: {
        text: `Valor del Índice (${currency})`,
        style: {
          color: "#ffffff",
        },
      },
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "yyyy-MM-dd HH:mm",
      },
      y: {
        formatter: (val) => `${val.toFixed(2)} ${currency}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: "#ffffff",
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="controls">
        <div className="rangeButtons">
          {["1d", "3d", "1w", "1m", "all"].map((timeRange) => (
            <button
              key={timeRange}
              className={`rangeButton ${
                range === timeRange ? "rangeButtonActive" : ""
              }`}
              onClick={() => setRange(timeRange as typeof range)}
            >
              {t(`chart.button.${timeRange}`)}
            </button>
          ))}
        </div>
        <div className="currencySelector">
          {["USD", "EUR"].map((currencyOption) => (
            <button
              key={currencyOption}
              className={`currencyButton ${
                currency === currencyOption ? "currencyButtonActive" : ""
              }`}
              onClick={() => setCurrency(currencyOption as "USD" | "EUR")}
            >
              {currencyOption}
            </button>
          ))}
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={processedSeries}
        type="line"
        height={600}
        width={1200}
      />
    </div>
  );
};
