"use client";
import "./Header.css";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import textLogo from "../../../../public/logos/textLogo.png";
import germanyFlag from "../../../../public/flags/germany.png";
import spainFlag from "../../../../public/flags/spain.png";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const [marketOpen, setMarketOpen] = useState(false);

  const isMarketOpen = (): boolean => {
    const currentHourUTC = new Date().getUTCHours();
    return currentHourUTC >= 8 && currentHourUTC < 14;
  };

  useEffect(() => {
    setMarketOpen(isMarketOpen());
    const interval = setInterval(() => setMarketOpen(isMarketOpen()), 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-Header">
      <div className="HeaderLeft">
        <img
          className="LogoHeader"
          src={textLogo.src}
          alt={t("header.textLogoAlt")}
          onClick={() => router.push("/")}
        />
      </div>

      

      <div className="HeaderRight">
        <button
          className={`NavButton ${
            pathname === "/empresas" ? "active" : ""
          }`}
          onClick={() => router.push("/empresas")}
        >
          {t("header.empresas")}
        </button>

        <button
          className={`NavButton ${
            pathname === "/participacionEmp" ? "active" : ""
          }`}
          onClick={() => router.push("/participacionEmp")}
        >
          {t("header.participacionEmp")}
        </button>

        <button
          className={`NavButton ${
            pathname === "/cotIndices" ? "active" : ""
          }`}
          onClick={() => router.push("/cotIndices")}
        >
          {t("header.indices")}
        </button>


        <div className="MarketStatus">
        <p className={`MarketStatusText ${marketOpen ? "open" : "closed"}`}>
          {marketOpen
            ? t("header.marketOpen", { hours: "09 - 15 " })
            : t("header.marketClosed")}
        </p>
      </div>
        <div className="LanguageSelector">
          <img
            src={germanyFlag.src}
            alt="Deutsch"
            className="LanguageFlag"
            onClick={() => changeLanguage("de")}
          />
          <img
            src={spainFlag.src}
            alt="Español"
            className="LanguageFlag"
            onClick={() => changeLanguage("es")}
          />
        </div>
      </div>
    </div>
  );
};
