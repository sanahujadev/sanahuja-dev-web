import type { PlantillaCiudad, LocalidadDB } from '../i18n/utils';

export const construirPlantillaDeCiudad = (
    template: PlantillaCiudad,
    ciudad: Omit<LocalidadDB, 'seoDataEn'>
) => {
    // stringify template
    let templateStr = JSON.stringify(template);
    let templateJson;
    // replace one by one
    templateStr = templateStr
        .replace('{{name}}', ciudad.name)
        .replace('{{municipality}}', ciudad.municipality)
        .replace('{{painPointId}}', ciudad.painPointId)
        .replace('{{slug}}', ciudad.slug)
        .replace('{{type}}', ciudad.type)
        .replace('{{zip}}', ciudad.zip)
        .replace('{{seoData.zone}}', ciudad.seoData.zone)
        .replace('{{seoData.usp_focus}}', ciudad.seoData.usp_focus)
        .replace('{{seoData.h2_solution}}', ciudad.seoData.h2_solution)
        .replace('{{seoData.h1_modifier}}', ciudad.seoData.h1_modifier)
        .replace('{{seoData.cta_text}}', ciudad.seoData.cta_text);

    // parseJson
    try {
        templateJson = JSON.parse(templateStr);
        return templateJson as PlantillaCiudad
    } catch (error) {
        throw new Error("Error al construir la ciudad " + ciudad.name + " - ", {cause: error});
    }
}

export const buildCiudad = (localidad: LocalidadDB, lang: 'es' | 'en') => {
  // extraemos seoData y seoDataEn para no incluirlos en "rest"
  const { seoData, seoDataEn, ...rest } = localidad;

  // definimos el tipo final sin seoDataEn
  const ciudad: Omit<LocalidadDB, 'seoDataEn'> = {
    ...rest,
    seoData: lang === "es" ? seoData : seoDataEn,
  };

  return ciudad;
};