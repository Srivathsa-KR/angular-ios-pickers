import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  HostListener,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { getClosestArrayElementToTarget } from '../utils/utils';

export enum DEFAULT_SETTING_ENUM {
  DEFAULT_TO_START= 'DEFAULT_TO_START',
  DEFAULT_TO_END = 'DEFAULT_TO_END',
  DEFAULT_TO_CLOSEST = 'DEFAULT_TO_CLOSEST',
};


const LIST_ITEM_HEIGHT = 50; //Height of each Item : px

const computeSelectedItemPosition = (itemIndex: number) => {
  const initialPosition = -1 * itemIndex * LIST_ITEM_HEIGHT;
  return initialPosition;
};
@Component({
  selector: 'app-ios-wheelpicker',
  templateUrl: './ios-wheelpicker.component.html',
  styleUrls: ['./ios-wheelpicker.component.scss'],
})
export class IosWheelpickerComponent implements OnInit, OnChanges {
  @Input('dataList') dataList: Array<any>;
  @Input('targetValue') targetValue: any;
  @Input('defaultSetting') defaultSetting: DEFAULT_SETTING_ENUM;
  @Input('indexOfSelected') indexOfSelected: number;
  @Output('onChange') changeEmitter = new EventEmitter<number>(true);
  @ViewChild('listContainer') listContainerEl: ElementRef;

  private offset: number = 0; //Variable denoting the magnitude and direction of the amount of scroll. Range?
  private previousYCoordinate: number | null = null;
  private currentPosition: number; //Range : (0, -(50[LIST_ITEM_HEIGHT] * len of array))
  private maxPossiblePosition: number; //-(50[LIST_ITEM_HEIGHT] * len of array)
  private scrollTimeout: number;
  private unlistenerArray: Array<() => void> = [];
  public inlineListStyle: Object;
  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    // console.log(change);
    if (change.dataList) {
      this.maxPossiblePosition = this.getMaxPossiblePosition();
    }
    if (change.indexOfSelected) {
      this.handleIndexOfSelectedChange(change.indexOfSelected.currentValue);
    }
  }

  onMouseMove(event:any) {
    const currentYCoordinate = event.touches ? event.touches[0].clientY : event.clientY; //handling multiple touches at any given time
    const computedOffset = currentYCoordinate - (this.previousYCoordinate || 0);
    this.previousYCoordinate = currentYCoordinate;
    this.setTargetPositionAndOffset(computedOffset);
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onMouseUp(event: any) {
    this.unlistenerArray.forEach((subsFunc) => subsFunc());
    this.unlistenerArray = [];
    this.handleScrollEnd();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: { touches: { clientY: number | null; }[]; clientY: number | null; }) {
    this.previousYCoordinate = event.touches ? event.touches[0].clientY : event.clientY; //handling multiple touches at any given time
    this.unlistenerArray.push(
      ...[
        this.renderer.listen(this.listContainerEl.nativeElement, 'mousemove', this.onMouseMove.bind(this)),
        this.renderer.listen(this.listContainerEl.nativeElement, 'touchmove', this.onMouseMove.bind(this)),
      ],
    );
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  @HostListener('wheel', ['$event'])
  OnWheelMoved(event: WheelEvent) {
    clearTimeout(this.scrollTimeout);
    const scrollAmt = -1 * event.deltaY;
    this.setTargetPositionAndOffset(scrollAmt);
    this.scrollTimeout = window.setTimeout(this.handleScrollEnd.bind(this), 225);
    return false;//Why?
  }

  private handleIndexOfSelectedChange(indexOfSelected: number): void {
    if (indexOfSelected === -1) {
      //Item not in the array
      const defaultIndex = this.getDefaultIndex();
      this.changeEmitter.emit(defaultIndex);
    } else {
      this.currentPosition = this.indexOfSelected ? computeSelectedItemPosition(indexOfSelected) : 0;
      this.setScrollAnimationStyle();
    }
  }

  private getMaxPossiblePosition(): number {
    return -1 * (this.dataList.length - 1) * LIST_ITEM_HEIGHT;
  }
  /**
   * 
   * @param offsetAmt 
   * This function is invoked by the even listeners that are invoked on Mouse Move
   * or during scroll
   */
  private setTargetPositionAndOffset(offsetAmt: number) {
    /*Offset range: 
      Scroll up(List going down) : [0, 300] 
      Scroll Down(List going up): [0, -300]
    */
    const computedPosition = this.currentPosition + offsetAmt;
    this.offset = offsetAmt;
    this.performPositionCorrectionAndAnimation(computedPosition);
  }

  private handleScrollEnd(): void {
    const posToBeRounded = this.currentPosition + (this.offset * 5); //Why 5?
    const roundedPosition = Math.round(posToBeRounded / LIST_ITEM_HEIGHT) * LIST_ITEM_HEIGHT;
    this.performPositionCorrectionAndAnimation(roundedPosition);
    this.changeEmitter.emit(-1 * this.currentPosition / LIST_ITEM_HEIGHT);
  }

  /**
   * 
   * @param interimPositionValue 
   * This function validates the given position, sets the position to the current position
   * and invokes the function to perform the scroll animation
   */
  private performPositionCorrectionAndAnimation(interimPositionValue: number) {
    const correctedPosition = Math.max(this.maxPossiblePosition, Math.min(0, interimPositionValue)); //Normalizing to Limit the scroll in between starting and ending position
    this.currentPosition = correctedPosition; //target position to be scrolled to
    this.setScrollAnimationStyle();
  }

  private setScrollAnimationStyle(): void {
    this.inlineListStyle = this.getScrollAnimationStyle(this.offset, this.currentPosition);
  }

  private getScrollAnimationStyle(offset: number, positionToBeScrolledTo: number): object {
    /*Offset range: 
      Scroll up(List going down) : [0, 300] 
      Scroll Down(List going up): [0, -300]
    */
    const style = {
      transition: `transform ${Math.abs(offset) / 100 + 0.1}s`, //The time required for the scroll animation depends on the distance between in the initial and the target positions
      transform: `translateY(${positionToBeScrolledTo}px)`,
    };
    return style;
  }

  private getDefaultIndex(): number {
    //Switch to be used
    if (this.defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_END) {
      return this.dataList.length - 1;
    } else if (this.defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_START) {
      return 0;
    } else { //else if (this.defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_CLOSEST)
      const closest = getClosestArrayElementToTarget(this.targetValue, this.dataList);
      const position = this.dataList.indexOf(closest);
      return position;
    }
  }
}
