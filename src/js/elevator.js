const cabina = document.getElementById("cabinaElevador");
const cable = document.getElementById("cableElevador");
const pantalla = document.getElementById("resultado");

// Coordenadas del eje respecto a la altura
const posInicialArriba = 40;
const posInicialAbajo = 340;
let posActual = posInicialAbajo;
let animacionId;

// Configuración inicial visual
cabina.style.top = posActual + "px";
cable.style.height = posActual + "px";

function iniciarSimulacion() {
  cancelAnimationFrame(animacionId);

  const masa = parseFloat(document.getElementById("masa").value);
  const acelMag = parseFloat(document.getElementById("aceleracion").value);
  const sube = document.getElementById("sube").checked;
  const acelera = document.getElementById("acelera").checked;
  const g = 9.8;

  if (isNaN(masa) || isNaN(acelMag) || masa <= 0 || acelMag < 0) {
    pantalla.innerHTML =
      "<span class='valor-critico text-danger'>Error: Parámetros inválidos.</span>";
    return;
  }

  // Lógica de la Segunda Ley de Newton
  let a = 0;
  if (sube) {
    a = acelera ? acelMag : -acelMag;
  } else {
    a = acelera ? -acelMag : acelMag;
  }

  const tension = masa * (g + a); ///Aplicacion de leyes
  const peso = masa * g;

  // Mostrar resultados en la pantalla
  let textoHtml = `Tensión (T) : <b>${tension.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} N</b><br>`;
  textoHtml += `Peso (W)    : <b>${peso.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} N</b><br><br>`;

  if (Math.abs(a + g) < 0.01) {
    textoHtml +=
      "<span class='valor-critico'>¡PELIGRO! Caída libre. El cable no ejerce fuerza (0 N).</span>";
  } else if (tension > peso) {
    textoHtml +=
      "Estado: El motor ejerce tracción extra. <br>Tensión > Peso.<br>"; //
    if (!sube && !acelera) {
      textoHtml +=
        "<span style='color:#a1a1aa; font-size: 0.9em;'>(Frenar la bajada requiere la misma fuerza neta hacia arriba que arrancar subiendo).</span>";
    }
  } else if (tension < peso) {
    textoHtml +=
      "Estado: Gravedad asiste el movimiento. <br>Tensión < Peso.<br>"; ///
    if (sube && !acelera) {
      textoHtml +=
        "<span style='color:#a1a1aa; font-size: 0.9em;'>(Frenar la subida requiere dejar que la gravedad actúe a favor).</span>";
    }
  } else {
    textoHtml += "Estado: Aceleración nula (Velocidad constante).";
  }
  pantalla.innerHTML = textoHtml;

  // Configuración de la animación
  let posInicial = sube ? posInicialAbajo : posInicialArriba;
  let posDestino = sube ? posInicialArriba : posInicialAbajo;
  let tiempo = 0;

  // Simulación visual
  function animar() {
    tiempo += 0.015;

    let progreso = 0;
    if (acelera) {
      progreso = Math.pow(tiempo, 2); // aceleración visual
    } else {
      progreso = 1 - Math.pow(1 - tiempo, 2); // desaceleración visual
    }

    if (tiempo < 1) {
      posActual = posInicial + (posDestino - posInicial) * progreso;
      cabina.style.top = posActual + "px";
      cable.style.height = posActual + "px";
      animacionId = requestAnimationFrame(animar);
    } else {
      cabina.style.top = posDestino + "px";
      cable.style.height = posDestino + "px";
    }
  }
  animar();
}
