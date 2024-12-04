'use client';
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next"; 
import './GraphsComponent.css';

interface GraphsProps {
  data: [string, number][];
  selectedType: "DIA" | "MES"; 
}

export const GraphsComponent: React.FC<GraphsProps> = ({ data, selectedType }) => {
  const { t } = useTranslation(); 

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      foreColor: "#000000",
      
    },
    labels: data.map(item => item[0]), 
     title: {
      text: t('', { type: t(`chart.type.${selectedType}`) }), 
      align: "left",
      style: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ffffff",
      },
      offsetY: 0,
    }, 
    legend: {
      position: "bottom",
    },
    tooltip: {
      theme: "light",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = data.map(item => item[1]);

  return (
    <div className="chart-container2">
      <ReactApexChart options={options} series={series} type="pie" width="600px" height="600px" />
    </div>
  );
};
