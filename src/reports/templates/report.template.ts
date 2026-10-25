import { CreateReportDto } from '../dtos/create-report.dto';

// Los datos los escribe un ciudadano y terminan dentro del HTML del correo:
// se escapan para que no puedan inyectar etiquetas ni atributos.
const escapeHtml = (value: string | number): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const SEVERITY_LABEL: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const SEVERITY_COLOR: Record<string, string> = {
  low: '#2f8f5b',
  medium: '#c98a1c',
  high: '#c1402f',
};

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid #dce7ea;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5a6f75;text-transform:uppercase;letter-spacing:.5px;">${label}</td>
    <td align="right" style="padding:12px 0;border-bottom:1px solid #dce7ea;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#17242b;font-weight:bold;">${escapeHtml(value)}</td>
  </tr>`;

export const generateReportTemplate = (
  dto: CreateReportDto,
  photoUrl: string,
): string => {
  const { address, description, severity, reporterPhone } = dto;
  const color = SEVERITY_COLOR[severity] ?? '#0077b6';
  const label = SEVERITY_LABEL[severity] ?? severity;
  const safePhoto = escapeHtml(photoUrl);

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Nueva fuga reportada</title>
  </head>
  <body style="margin:0;padding:0;background-color:#eff3f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eff3f5;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background-color:${color};padding:28px 32px;">
                <p style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#ffffff;opacity:.85;">Aviso a cuadrilla &middot; Severidad ${escapeHtml(label)}</p>
                <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:24px;color:#ffffff;">🚨 Fuga de agua reportada</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <p style="margin:0 0 10px 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5a6f75;text-transform:uppercase;letter-spacing:.5px;">Foto de la fuga</p>
                <a href="${safePhoto}" target="_blank" style="text-decoration:none;">
                  <img src="${safePhoto}" alt="Foto de la fuga en ${escapeHtml(address)}" width="496" style="display:block;width:100%;max-width:496px;height:auto;border:0;border-radius:10px;" />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row('Dirección', address)}
${row('Descripción', description)}
${row('Severidad', label)}
${row('Teléfono de contacto', reporterPhone)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color:#edf2f7;padding:12px 24px;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#a0aec0;">
                AguaFix API — Sistema Automatizado de Reportes Ciudadanos
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
