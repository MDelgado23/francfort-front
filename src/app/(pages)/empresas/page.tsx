"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Importa el hook para traducción
import { CardsCot } from "@/app/components/CardsCot/CardsCot";
import LineasEmp from "@/app/components/LineasEmp/LineasEmp";
import "./empresas.css";

const arrCodEmpresas = [
  "AAPL",
  "TSLA",
  "JPM",
  "ROG.SW",
  "SHEL",
  "MSFT",
  "META",
];

const EmpresasPage = () => {
  const { t } = useTranslation(); // Usa el hook de traducción
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);

  const handleViewChart = (codEmpresa: string) => {
    setSelectedEmpresa(codEmpresa);
    setShowModal(true);
  };

  return (
    <div className="cards-container">
      <h1 className="cards-title">{t("chart.title")}</h1> {/* Traducción dinámica */}
      <div className="cards-grid">
        {arrCodEmpresas.map((codEmpresa) => (
          <CardsCot
            key={codEmpresa}
            codEmpresa={codEmpresa}
            onViewChart={() => handleViewChart(codEmpresa)} // Pasa la función para abrir el modal
          />
        ))}
      </div>

      {showModal && selectedEmpresa && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            {/* Componente LineChart */}
            <LineasEmp
              cod={selectedEmpresa} // Pasa el código de la empresa seleccionada
              onClose={() => setShowModal(false)} // Cierra el modal al terminar
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresasPage;
