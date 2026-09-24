# Intención confirmada — portafolio de j.gut

Confirmada por el usuario tras la entrevista (2026-09-24).

- **Resultado:** Un portafolio web en inglés para j.gut (José), ilustrador de concept art y splash arts. Abre con un hero cinematográfico de 4 frames controlado por scroll (blur + zoom rápido, como cámara en mano; textos mínimos y algo crípticos; CTA en el último frame). Luego pasa a una página clara con 5 ilustraciones en tarjetas verticales; al hacer clic, cada una se amplía con su descripción y, si la tiene, su speed drawing.
- **Para quién:** Reclutadores y directores de arte (Riot y estudios parecidos) y clientes que quieran encargos.
- **Por qué ahora:** José necesita un portafolio propio que muestre que cuida cómo presenta su trabajo. Instagram queda como el atajo para ver mucho arte rápido.
- **Éxito:** El visitante se lleva la impresión de "esta persona cuida los detalles" y contacta a José por Instagram o correo. Además, el hero se puede reemplazar más adelante por frames hechos por José sin reescribir la animación.
- **Restricción:** Stack Next.js, React, TypeScript, Tailwind, GSAP con ScrollTrigger, Lenis y Canvas 2D, desplegado en Vercel. Sin plazo. Git con commits pequeños, un tag por checkpoint y ramas para los experimentos, para poder volver atrás.
- **Fuera de alcance:** Vender algo, backend o CMS, formulario propio, blog, más idiomas, el portafolio completo (lo cubre Instagram), 3D o WebGL. No aparece nombre ni alias en pantalla, solo el logo de la máscara.

## Decisiones posteriores

- Sello: el logo de la máscara (SVG transparente) sobre el frame 1.
- Cultura japonesa: kanji en escritura vertical. Tipografía elegida: dirección A (Unbounded + Shippori Mincho + JetBrains Mono + DM Sans).
- Contacto: Instagram https://www.instagram.com/jgut.art/ · correo josegut.art@gmail.com
- Metadatos: título "José Gutierrez - Illustration Portfolio"; descripción en inglés (ver `app/layout.tsx`).
- Los frames del hero están generados con IA (Gemini); José lo sabe y está de acuerdo, y podría reemplazarlos más adelante por frames propios.
