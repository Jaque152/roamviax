import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, resCode, items, total } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Viajes.mx <onboarding@resend.dev>',
      to: [email],
      subject: `Confirmación de Reservación: ${resCode}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>¡Hola, ${customerName}!</h2>
          <p>Tu reservación ha sido confirmada con éxito.</p>
          <div style="background: #fff7ed; padding: 20px; border-radius: 10px; border: 1px solid #ffedd5;">
            <span style="font-size: 12px; color: #9a3412; font-weight: bold;">CÓDIGO DE RESERVACIÓN</span>
            <h1 style="margin: 0; color: #c2410c;">${resCode}</h1>
          </div>
          <h3>Detalle de tu viaje:</h3>
          ${items.map((item: any) => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <strong>${item.experience_title}</strong><br/>
              Fecha: ${item.travel_date} | Personas: ${item.pax_qty}<br/>
              Paquete: ${item.package_name} | Total: $${item.subtotal}
            </div>
          `).join('')}
          <h2 style="text-align: right;">Total: $${total}</h2>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}