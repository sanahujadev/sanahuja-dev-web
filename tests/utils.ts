/**
 * Parsea el contenido de un script JSON-LD de forma segura
 * Playwright devuelve el JSON escapado como string. Esta función lo limpia.
 */
export function parseSchemaJSON(content: string | null): any {
  if (!content) return null;
  
  try {
    // Limpia escapes y caracteres de control
    const cleaned = content
      .replace(/\\\"/g, '"') // Reemplaza \" por "
      .replace(/^"|"$/g, '') // Quita comillas del inicio/fin si las hay
      .trim();
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Schema JSON inválido:', error);
    return null;
  }
}

/**
 * Valida que un schema tenga exactamente N items en itemListElement
 * Usa esto en lugar del regex complicado.
 */
export function validateItemListCount(schema: any, expectedCount: number): boolean {
  if (!schema || !schema.itemListElement) return false;
  return Array.isArray(schema.itemListElement) && schema.itemListElement.length === expectedCount;
}

/**
 * Valida que TODOS los items de itemListElement tengan billingIncrement: "monthly"
 * Esto es CRÍTICO para que Google entienda que son suscripciones, no productos únicos.
 */
export function validateAllBillingIncrement(schema: any): boolean {
  if (!schema || !Array.isArray(schema.itemListElement)) return false;

  return schema.itemListElement.every((item: any) => 
    item?.offers?.priceSpecification?.billingIncrement === 'monthly'
  );
}