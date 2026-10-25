import { generateReportTemplate } from './report.template';

describe('generateReportTemplate', () => {
  const dto: any = {
    address: 'Av. Principal 123',
    description: 'Fuga en la banqueta',
    severity: 'high',
    reporterPhone: '4771234567',
  };

  it('muestra la foto de la fuga con una etiqueta <img>', () => {
    const html = generateReportTemplate(dto, 'https://bucket/reports/a.jpg');

    expect(html).toContain('<img src="https://bucket/reports/a.jpg"');
  });

  it('incluye dirección, descripción, severidad y teléfono', () => {
    const html = generateReportTemplate(dto, 'https://x/a.jpg');

    expect(html).toContain('Av. Principal 123');
    expect(html).toContain('Fuga en la banqueta');
    expect(html).toContain('Alta');
    expect(html).toContain('4771234567');
  });

  it('escapa el HTML que escribe el ciudadano y la URL de la foto', () => {
    const html = generateReportTemplate(
      { ...dto, description: '<script>x</script>', address: '"><b>' },
      'https://x/a.jpg" onerror="y',
    );

    expect(html).not.toContain('<script>x</script>');
    expect(html).not.toContain('onerror="y');
    expect(html).toContain('&lt;script&gt;');
  });
});
