// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite(bgImg, fgImg, fgOpac, fgPos) {
  console.log("composing");
  console.log("bgImg", bgImg);
  console.log("fgImg", fgImg);
  console.log("fgOpac", fgOpac);
  console.log("fgPos", fgPos);

  let fgX = fgPos.x;
  let fgY = fgPos.y;
  let fgWidth = fgImg.width;
  let fgHeight = fgImg.height;

  // Loop over rows (y-axis)
  for (let y = fgY; y < fgHeight + fgY; y++) {
    // Loop over columns (x-axis)
    for (let x = fgX; x < fgWidth + fgX; x++) {
      // Check if the pixel is outside the background image
      if (x < 0 || x >= bgImg.width || y < 0 || y >= bgImg.height) {
        continue;
      }

      // Calculate pixel index in bgImg.data array
      let bgIndex = (y * bgImg.width + x) * 4; // Multiply by 4 because of RGBA
      let br = bgImg.data[bgIndex]; // Red
      let bg = bgImg.data[bgIndex + 1]; // Green
      let bb = bgImg.data[bgIndex + 2]; // Blue
      let ba = bgImg.data[bgIndex + 3]; // Alpha

      // Calculate pixel index in fgImg.data array
      let fgIndex = ((y - fgY) * fgWidth + (x - fgX)) * 4; // Multiply by 4 because of RGBA
      let fr = fgImg.data[fgIndex]; // Red
      let fg = fgImg.data[fgIndex + 1]; // Green
      let fb = fgImg.data[fgIndex + 2]; // Blue
      let fa = fgImg.data[fgIndex + 3]; // Alpha

      // Normalize the alpha values
      fa = fgImg.data[fgIndex + 3] / 255;
      ba = bgImg.data[bgIndex + 3] / 255;

      // Calculate final alpha
      let fa_final = fa * fgOpac;
      outA = fa_final + ba * (1 - fa_final);

      // Calculate the new pixel values
      let outR = (fr * fa_final + br * ba * (1 - fa_final)) / outA;
      let outG = (fg * fa_final + bg * ba * (1 - fa_final)) / outA;
      let outB = (fb * fa_final + bb * ba * (1 - fa_final)) / outA;
      outA *= 255;

      bgImg.data[bgIndex] = Math.round(outR);
      bgImg.data[bgIndex + 1] = Math.round(outG);
      bgImg.data[bgIndex + 2] = Math.round(outB);
      bgImg.data[bgIndex + 3] = Math.round(outA);
    }
  }
}
