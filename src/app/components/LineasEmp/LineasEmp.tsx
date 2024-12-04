"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { toZonedTime } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import clienteAxios, { baseURL } from "@/app/services/axiosInstance";
import "./LineasEmp.css";

type LineasProps = {
  cod: string;
  onClose: () => void;
};

const currencies = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];

const LineasEmp: React.FC<LineasProps> = ({ cod, onClose }) => {
  const { t } = useTranslation();
  const [range, setRange] = useState<"1d" | "3d" | "1w" | "1m" | "all">("1d");
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
  const [conversionRate, setConversionRate] = useState<number>(1); // Inicialmente 1 para USD
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversionRate = async () => {
    try {
      const rate = 0.85;
      setConversionRate(rate);
    } catch (err) {
      console.error("Error al obtener la tasa de conversión:", err);
      setConversionRate(1); // En caso de error, usamos 1 (sin conversión)
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, []);

  const processLineCotizations = (data: any[]) => {
    return data
      .filter(
        (item) => item.fecha && item.hora && !isNaN(parseFloat(item.cotizacion))
      )
      .map((item) => {
        const datetime = `${item.fecha}T${item.hora}:00Z`;
        const zonedDate = toZonedTime(new Date(datetime), "Europe/Berlin");
        return {
          x: zonedDate.getTime(),
          y: parseFloat(item.cotizacion),
        };
      });
  };

  const filterDataByRange = (
    data: any[],
    range: "1d" | "3d" | "1w" | "1m" | "all"
  ) => {
    if (range === "all") return data;

    const now = Date.now();
    const rangesInDays: Record<string, number> = {
      "1d": 1,
      "3d": 3,
      "1w": 7,
      "1m": 30,
    };

    const days = rangesInDays[range];
    return data.filter((item) => now - item.x <= days * 24 * 60 * 60 * 1000);
  };

  useEffect(() => {
    const loadCotizations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await clienteAxios.get(
          `${baseURL}/cotizaciones/allCotizacionEmpByCod/${cod}`
        );
        const processed = processLineCotizations(response.data);
        setRawData(processed);
      } catch (err) {
        setError("Hubo un problema al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    loadCotizations();
  }, [cod]);

  const filteredData = useMemo(() => {
    const dataInRange = filterDataByRange(rawData, range);

    if (currency === "EUR") {
      return dataInRange.map((item) => ({
        x: item.x,
        y: item.y * conversionRate,
      }));
    }

    return dataInRange;
  }, [range, rawData, currency, conversionRate]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: true,
        },
        background: "#1e1e2f",
      },
      title: {
        text: `${t("chart.title")} (${currency})`,
        align: "center",
        style: {
          color: "#ffffff",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "dd/MM HH:mm",
          datetimeUTC: false,
          style: {
            colors: "#ffffff",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => val.toFixed(2),
          style: {
            colors: "#ffffff",
          },
        },
        title: {
          text: `${t("chart.price")} (${currency})`,
          style: {
            color: "#ffffff",
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: ["#4caf50"],
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd/MM/yyyy HH:mm",
        },
        y: {
          formatter: (val) => `${val.toFixed(2)} ${currency}`,
        },
      },
    }),
    [t, currency]
  );

  const series = [
    {
      name: t("chart.seriesName"),
      data: filteredData,
    },
  ];

  return (
    <div className="chartContainer">
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
          {currencies.map(({ label, value }) => (
            <button
              key={value}
              className={`currencyButton ${
                currency === value ? "currencyButtonActive" : ""
              }`}
              onClick={() => setCurrency(value as "USD" | "EUR")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loadingText">{t("loading")}</p>
      ) : error ? (
        <p className="errorText">{error}</p>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      )}

      <button onClick={onClose} className="closeButton">
        {t("chart.close")}
      </button>
    </div>
  );
};

export default LineasEmp;
