
import { describe, it, expect } from "vitest";
import localidades from "../../src/i18n/auto/localidades.json";
import plantillaJson from "../../src/i18n/auto/plantilla-ciudades.json";
import {
  buildCiudad,
  construirPlantillaDeCiudad,
} from "../../src/scripts/utils";
import type { LocalidadDB, PlantillaCiudad } from "../../src/i18n/utils";

describe("construirPlantillaDeCiudad", () => {
  it("should replace all placeholders for all localities and languages", () => {
    const langs: ("es" | "en")[] = ["es", "en"];

    for (const localidad of localidades as LocalidadDB[]) {
      for (const lang of langs) {
        const tpl = plantillaJson[lang] as PlantillaCiudad;
        const ciudad = buildCiudad(localidad, lang);
        
        const copy = construirPlantillaDeCiudad(tpl, ciudad);
        const copyString = JSON.stringify(copy);
        expect(copyString).not.toContain("{{");
        // expect(copyString).not.toContain("}}");
      }
    }
  });
});
