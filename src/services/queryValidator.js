const ALLOWED_OPERATIONS = new Set(["find", "aggregate"]);

const BLOCKED_OPERATORS = new Set([
  "$out",
  "$merge",
  "$function",
  "$where",
  "$accumulator",
  "$set",
  "$unset",
  "$rename",
  "$replaceWith",
  "$replaceRoot",
  "$delete",
  "$update",
  "$drop"
]);

function scanForBlockedOperators(value) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      scanForBlockedOperators(item);
    }
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (BLOCKED_OPERATORS.has(key)) {
      throw new Error(`Blocked MongoDB operator: ${key}`);
    }

    scanForBlockedOperators(child);
  }
}

export function validateMongoQuery(query) {
  if (!query || typeof query !== "object") {
    throw new Error("Gemini returned an invalid query.");
  }

  if (!ALLOWED_OPERATIONS.has(query.operation)) {
    throw new Error(
      `Unsupported MongoDB operation: ${query.operation}`
    );
  }

  if (query.operation === "aggregate") {
    if (!Array.isArray(query.pipeline)) {
      throw new Error("Aggregate query must contain a pipeline.");
    }
  }

  if (query.operation === "find") {
    if (
      query.filter !== undefined &&
      (typeof query.filter !== "object" || Array.isArray(query.filter))
    ) {
      throw new Error("Find query contains an invalid filter.");
    }
  }

  scanForBlockedOperators(query);

  return true;
}