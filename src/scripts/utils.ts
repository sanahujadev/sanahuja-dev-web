import type { PlantillaCiudad, LocalidadDB } from "../i18n/utils";

export const construirPlantillaDeCiudad = (
  template: PlantillaCiudad,
  ciudad: Omit<LocalidadDB, "seoDataEn">,
) => {
  // stringify template
  let templateStr = JSON.stringify(template);
  let templateJson;
  // replace one by one
  templateStr = templateStr
    .replaceAll("{{name}}", ciudad.name)
    .replaceAll("{{municipality}}", ciudad.municipality)
    .replaceAll("{{painPointId}}", ciudad.painPointId)
    .replaceAll("{{slug}}", ciudad.slug)
    .replaceAll("{{type}}", ciudad.type)
    .replaceAll("{{zip}}", ciudad.zip)
    .replaceAll("{{seoData.zone}}", ciudad.seoData.zone)
    .replaceAll("{{seoData.usp_focus}}", ciudad.seoData.usp_focus)
    .replaceAll("{{seoData.h2_solution}}", ciudad.seoData.h2_solution)
    .replaceAll("{{seoData.h1_modifier}}", ciudad.seoData.h1_modifier)
    .replaceAll("{{seoData.cta_text}}", ciudad.seoData.cta_text);

  // parseJson
  try {
    templateJson = JSON.parse(templateStr);
    return templateJson as PlantillaCiudad;
  } catch (error) {
    throw new Error("Error al construir la ciudad " + ciudad.name + " - ", {
      cause: error,
    });
  }
};

export const buildCiudad = (localidad: LocalidadDB, lang: "es" | "en") => {
  // extraemos seoData y seoDataEn para no incluirlos en "rest"
  const { seoData, seoDataEn, ...rest } = localidad;

  // definimos el tipo final sin seoDataEn
  const ciudad: Omit<LocalidadDB, "seoDataEn"> = {
    ...rest,
    seoData: lang === "es" ? seoData : seoDataEn,
  };

  return ciudad;
};
