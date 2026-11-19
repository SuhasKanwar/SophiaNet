/** Preserve safe errors returned by the AI service, including guardrail rejections. */
export async function aiErrorResponse(response: Response, fallback: string) {
  const error = await response.json().catch(() => null);
  return Response.json(
    { success: false, message: typeof error?.message === 'string' ? error.message : fallback },
    { status: response.status },
  );
}
