import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ThumbnailService} from "../services/thumbnail.service";
import {Observable} from "rxjs";
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from "@angular/cdk/drag-drop";
import {CanvasMethods} from "./CanvasMethods";

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {

  constructor(private _thumbnailService: ThumbnailService,
              private changeDetectorRef: ChangeDetectorRef) {
              this.canvasMethods = new CanvasMethods();
  }

  //canvas orientation - 9:16(portrait) or 16:9(landscape)
  orientation: string = 'portrait';
  //initial data for images
  thumbNails: Array<any> = [];
  //images selected by dropping on canvas
  selectedImages: Array<any> = [];
  //height of canvas
  canvasWidth: number = 0;
  //width of canvas
  canvasHeight: number = 0;
  //variable to keep track of zoom level
  zoomLevel: number = 1;
  //CanvasMethods instance variable
  canvasMethods: CanvasMethods = null;

  @ViewChild('mainCanvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasContainer', {static: true})
  canvasContainer: ElementRef;

  private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    //Fetch thumbnail data i.e. images which can be dragged on canvas and edited
    this._fetchThumbNailData();

    //Get context of the canvas
    this.ctx = this.canvas.nativeElement.getContext('2d');

    //Set the initial width and height of the canvas equal to its parent in portrait mode
    //In portrait mode the parent has initial aspect ratio of 9:16 which is set using css according to available height
    this._setCanvasParams();
  }

  _fetchThumbNailData = () => {
    this._thumbnailService.getThumbnails().subscribe((data) => {
      //Initializing empty array on each call; directly pushing data into may lead to duplicate data if the api is called more than once
      //Pagination not handled as of now
      let images_urls = [];
      data.forEach((item) => {
        images_urls.push(item.download_url)
      })
      this.thumbNails = images_urls;
    });
  }

  //Set canvas dimensions
  _setCanvasParams = () => {
    //Detect changes if the size of the parent element changes
    this.changeDetectorRef.detectChanges();

    //Set canvas width and height equal to the width and height of the parent
    this.canvasWidth = this.canvasContainer.nativeElement.offsetWidth;
    this.canvasHeight = this.canvasContainer.nativeElement.clientHeight;
    this.ctx.canvas.width = this.canvasWidth;
    this.ctx.canvas.height = this.canvasHeight;
  }

  //Change orientation of the canvas - 9:16(portrait) and 16:9 (landscape) modes
  setOrientation = () => {
    this.orientation = this.orientation == 'landscape' ? 'portrait' : 'landscape';

    //Set new dimensions for the canvas
    this._setCanvasParams();

    //Re-render the image with new dimensions
    this.canvasMethods.renderImage(this.ctx, this.canvasWidth, this.canvasHeight, this.selectedImages[0]);
  }

  //Drag and drop images from left panel into the canvas
  selectImage = (event: CdkDragDrop<Array<Object>, any>) => {

    //Only if the image is dropped into the canvas, copy it to selectedImages array.
    // Do nothing if dropped back in the left panel again so that it can be reused if needed in future
    if (event.previousContainer !== event.container) {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      //Re-render the image with new data
      this.canvasMethods.renderImage(this.ctx, this.canvasWidth, this.canvasHeight, this.selectedImages[0]);
    }
  }

  // Zoom in and out
  zoomInAndOut = (zoomType) => {
    // zoomType == parameter which checks whether we are zooming in or zooming out
    //If zooming in set the current zoom level to 10% more of last zoom level else 10% less of last zoom level
    this.zoomLevel = this.zoomLevel * (zoomType == "in" ? 1.1 : 0.9);
    this.canvasMethods.zoomInAndOut(this.ctx, this.canvasWidth, this.canvasHeight, this.selectedImages[0], this.zoomLevel);
  }
}

