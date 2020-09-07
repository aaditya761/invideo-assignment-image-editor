export class CanvasMethods {

  public renderImage = (ctx, canvasWidth, canvasHeight, src) => {
    let img = new Image();
    img.src = src;
    let [height, width] = this._getHeightWidth(img, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //To keep the image horizontally and vertically centered, dx and dy are adjusted according canvas and image dimensions
    // width - 2 => 2 pixels are removed to account for the border
    ctx.drawImage(img, canvasWidth / 2 - width / 2, canvasHeight / 2 - height / 2, width - 2, height);
  }

  public zoomInAndOut = (ctx, canvasWidth, canvasHeight, src, zoomLevel) => {
    let img = new Image();
    img.src = src;
    let [height, width] = this._getHeightWidth(img, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, canvasWidth / 2 - width * zoomLevel / 2, canvasHeight / 2 - height * zoomLevel / 2, (width - 2) * zoomLevel, (height) * zoomLevel);
  }

  private _getHeightWidth = (img, canvasWidth, canvasHeight) => {
    let height = 0;
    let width = 0;
    //If the width of the image is more than its height and the aspect ratio of canvas is 9:16,
    //to maintain the aspect ratio of image let the width of the image be equal to the width of the canvas
    // and let the height be in proportion to the original aspect ratio of the image
    if (img.width > img.height) {
      width = canvasWidth;
      height = canvasWidth * img.height / img.width;
    }
    //If the height of the image is more than its width and the aspect ratio of canvas is 9:16,
    // to maintain the aspect ratio of image let the height of the image be equal to the height of the canvas
    // and let the width be in proportion to the original aspect ratio of the image
    else {
      height = canvasHeight;
      width = canvasHeight * img.width / img.height;
    }
    return [height, width];
  }


}
