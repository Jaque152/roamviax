import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Añadimos 'phone' que viene del formulario de contacto
    const { type, customerName, email, phone, destination, message, locale, budget, startDate, travelers } = body; 

    // 1. ABRIR EL CANDADO: Permitimos QUOTE y CONTACT
    if (type !== 'QUOTE' && type !== 'CONTACT') {
      return NextResponse.json({ error: "Tipo de correo no soportado" }, { status: 400 });
    }

    // Colores de la nueva marca Roamviax
    const bgDark = '#090a0b'; // Fondo casi negro
    const textAccent = '#a88947'; // Dorado/Champaña oscuro
    const isEnglish = locale === 'en';

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const greeting = isEnglish ? `Hello ${customerName},` : `Estimado/a ${customerName},`;

    // ==========================================
    // LÓGICA PARA COTIZACIONES (QUOTE)
    // ==========================================
    if (type === 'QUOTE') {
      subjectClient = isEnglish 
        ? `[Quote Request] We are designing your trip - roamviax` 
        : `Estamos diseñando tu viaje - roamviax`;
      subjectInternal = `[NUEVA COTIZACIÓN] - ${destination} - ${customerName}`;

      const bodyText = isEnglish
        ? `We received your request to travel to <strong>${destination}</strong>. One of our expert advisors is already reviewing your details and will contact you in less than 24 hours.`
        : `Hemos recibido tu solicitud para viajar a <strong>${destination}</strong>. Uno de nuestros asesores expertos ya está revisando tus detalles y se pondrá en contacto contigo en menos de 24 horas.`;
      
      htmlClient = `
        <div style="font-family: 'Georgia', serif; color: #111; max-width: 600px; margin: auto; border: 1px solid #eaeaea;">
          <div style="background-color: ${bgDark}; padding: 40px 20px; text-align: center;">
            <h1 style="color: #fff; font-size: 28px; margin: 0; font-style: italic; letter-spacing: 2px;">roamviax</h1>
            <p style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px;">Viajes de lujo</p>
          </div>
          <div style="padding: 40px 30px; font-family: 'Helvetica Neue', Helvetica, sans-serif;">
            <h2 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: normal;">${greeting}</h2>
            <p style="line-height: 1.6; color: #444;">${bodyText}</p>
                        
            <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #eaeaea;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 15px;">${isEnglish ? 'Trip Details' : 'Detalles de la Solicitud'}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>${isEnglish ? 'Date:' : 'Fecha:'}</strong> ${startDate}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>${isEnglish ? 'Travelers:' : 'Viajeros:'}</strong> ${travelers}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>${isEnglish ? 'Budget:' : 'Presupuesto:'}</strong> ${budget}</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-left: 2px solid ${bgDark}; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 13px; font-style: italic; color: #555;">"${message}"</p>
            </div>
            
            <a href="https://roamviax.com/${locale}/#experiencias" style="display: inline-block; background-color: ${bgDark}; color: #fff; padding: 14px 28px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
              ${isEnglish ? 'Explore Experiences' : 'Explorar Experiencias'}
            </a>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: ${textAccent};">Nueva Solicitud de Cotización</h2>
          <hr/>
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Destino:</strong> ${destination}</p>
          <p><strong>Fecha:</strong> ${startDate}</p>
          <p><strong>Viajeros:</strong> ${travelers}</p>
          <p><strong>Presupuesto:</strong> ${budget}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Requerimientos Especiales:</strong></p>
          <p style="background: #f4f4f4; padding: 15px;">${message}</p>
        </div>
      `;
    } 
    
    // ==========================================
    // LÓGICA PARA CONTACTO GENERAL (CONTACT)
    // ==========================================
    else if (type === 'CONTACT') {
      subjectClient = isEnglish 
        ? `[Message Received] Thank you for reaching out - roamviax` 
        : `Hemos recibido tu mensaje - roamviax`;
      subjectInternal = `[NUEVO MENSAJE DE CONTACTO] - ${customerName}`;

      const bodyText = isEnglish
        ? `Thank you for contacting us. We have successfully received your message and our team will get back to you shortly.`
        : `Gracias por comunicarte con nosotros. Hemos recibido tu mensaje con éxito y nuestro equipo te responderá a la brevedad.`;

      htmlClient = `
        <div style="font-family: 'Georgia', serif; color: #111; max-width: 600px; margin: auto; border: 1px solid #eaeaea;">
          <div style="background-color: ${bgDark}; padding: 40px 20px; text-align: center;">
            <h1 style="color: #fff; font-size: 28px; margin: 0; font-style: italic; letter-spacing: 2px;">roamviax</h1>
          </div>
          <div style="padding: 40px 30px; font-family: 'Helvetica Neue', Helvetica, sans-serif;">
            <h2 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: normal;">${greeting}</h2>
            <p style="line-height: 1.6; color: #444;">${bodyText}</p>
            
            <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #eaeaea;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 15px;">${isEnglish ? 'Your Message' : 'Tu Mensaje'}</p>
              <p style="font-size: 14px; font-style: italic; color: #555;">"${message}"</p>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: ${bgDark};">Nuevo Mensaje de Contacto</h2>
          <hr/>
          <p><strong>Nombre:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f4f4f4; padding: 15px;">${message}</p>
        </div>
      `;
    }

    // 2. ENVIAR CORREO AL CLIENTE
    const { data, error } = await resend.emails.send({
      from: 'roamviax <informes@roamviax.com>', // Asegúrate de que este correo esté verificado en Resend
      to: [email], 
      subject: subjectClient,
      html: htmlClient,
    });

    // 3. ENVIAR NOTIFICACIÓN INTERNA AL EQUIPO
    await resend.emails.send({
      from: 'Sistema roamviax <informes@roamviax.com>',
      to: ['contacto@roamviax.com'],
      subject: subjectInternal,
      html: htmlInternal,
    });

    if (error) {
      console.error("Error de Resend:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error crítico en API Send:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}