import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ThumbnailService} from "../services/thumbnail.service";
import {Observable} from "rxjs";
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {

  constructor(private _thumbnailService: ThumbnailService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  orientation: string = 'portrait';
  thumbNails: Array<any> = [];
  selectedImages: Array<any> = [];
  selectedImage: Object = this.selectedImages[this.selectedImages.length - 1];
  canvasWidth: number = 0;
  canvasHeight: number = 0;

  setOrientation = () => {
    this.orientation = this.orientation == 'landscape' ? 'portrait' : 'landscape';
    this.changeDetectorRef.detectChanges();
    this.canvasWidth = this.canvasContainer.nativeElement.offsetWidth;
    this.canvasHeight = this.canvasContainer.nativeElement.clientHeight;
    this.ctx.canvas.width = this.canvasWidth;
    this.ctx.canvas.height = this.canvasHeight;
    this._renderImage();
  }


  selectImage = (event: CdkDragDrop<Array<Object>, any>) => {
    if (event.previousContainer !== event.container) {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this._renderImage();
    }
  }


  @ViewChild('mainCanvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasContainer', {static: true})
  canvasContainer: ElementRef;

  private ctx: CanvasRenderingContext2D;

  _renderImage = () => {
    let img = new Image();
    img.src = this.selectedImages[0];
    let height = 0;
    let width = 0;
    if (img.width > img.height) {
      width = this.canvasWidth;
      height = this.canvasWidth * img.height / img.width;
    } else {
      height = this.canvasHeight;
      width = this.canvasHeight * img.width / img.height;
    }
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.drawImage(img, this.canvasWidth / 2 - width / 2, this.canvasHeight / 2 - height / 2, width, height);
  }

  ngOnInit(): void {
    this._thumbnailService.getThumbnails().subscribe((data) => {
      let images_urls = [];
      data.forEach((item) => {
        images_urls.push(item.download_url)
      })
      this.thumbNails = images_urls;
    });

    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.changeDetectorRef.detectChanges();
    this.canvasWidth = this.canvasContainer.nativeElement.offsetWidth;
    this.canvasHeight = this.canvasContainer.nativeElement.clientHeight;
    this.ctx.canvas.width = this.canvasWidth;
    this.ctx.canvas.height = this.canvasHeight;
  }
}
