import Pin from '../View/Pin';
import Input from '../View/Input';
import Line from '../View/Line';
import Model from '../Model';
import Slider from '../View/Slider';

export default class Presenter {
  private block: JQuery<HTMLElement>;
  private options: any;
  private line: any;
  private model: any;
  private slider: any;
  private rangeKo: number;
  private totalSize: number;
  private pinValues: Array<number>;
  private pinUpValues: Array<number>;

  constructor(block: JQuery<HTMLElement>, options: any) {
    this.block = block;
    this.options = options;
    this.slider = new Slider();
    this.slider.createSlider(this.block, this.options);
    this.model = new Model();
    // this.totalSize = this.line.getLineSize();
    this.totalSize = 300;
    this.pinUpValues = [...this.options.values];
    this.rangeKo = this.model.getRangeKo(this.totalSize, this.options);

    this.renderDomElements();
  };

  private renderDomElements = () => {
    console.log('renderDomElements', this.options)
    this.pinValues = this.model.setStartValues(this.options.values, this.totalSize, this.options.min, this.options.max);
    this.line = new Line(this.block, this.options.orientation);
    this.line.setLinePosition(this.pinValues);

    this.options.values.forEach((it, idx) => {
      const pinPosition: number = this.totalSize / (this.options.max - this.options.min) * (it -  this.options.min);
      const pin: any = new Pin(this.line.getDomElement(), pinPosition, this.options.pinUp, it, this.options.orientation);
      const input: any = new Input(this.block, it, this.options.min, this.options.max);
      pin.getDomElement().addEventListener('mousedown', this.onPinMove(this.model, pin, input, this.options, idx));

      input.getDomElement().addEventListener('change', (ev) => {
        const pinPosition: number = this.model.calculatePinPosition((ev.target.value - this.options.min) / this.rangeKo, this.totalSize);
        const pinUpValue: number = this.model.calculateContent((ev.target.value - this.options.min) / this.rangeKo, this.options, this.totalSize);

        this.pinValues[idx] = this.model.validateData(this.pinValues, pinPosition, idx);
        this.pinUpValues[idx] = this.model.validateData(this.pinUpValues, pinUpValue, idx);

        ev.target.value = this.pinUpValues[idx];

        pin.setPinValue(this.pinValues[idx], this.options.pinUp, this.pinUpValues[idx]);

        this.line.setLinePosition(this.pinValues);
      });
    });
  };

  private onPinMove = (model, pin, input, options, idx) => (evt) => {
    evt.preventDefault();

    let startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    let dragged = false;

    const onMouseMove = (moveEvt) => {
      moveEvt.preventDefault();
      dragged = true;

      const coordinate = (options.orientation === 'vertical') ? startCoordinates.y : startCoordinates.x;
      const move = (options.orientation === 'vertical') ? moveEvt.clientY : moveEvt.clientX;

      const shift: number = model.setShift(coordinate, move, this.totalSize, pin.getPinPosition(), this.options.step, this.rangeKo);

      const pinPosition = model.calculatePinPosition(shift, this.totalSize);
      const pinUpValue = model.calculateContent(pinPosition, options, this.totalSize);

      this.pinValues[idx] = model.validateData(this.pinValues, pinPosition, idx);

      pin.setPinValue(this.pinValues[idx], options.pinUp, pinUpValue);

      input.setInputValue(pinUpValue);

      this.line.setLinePosition(this.pinValues);

      if (move - coordinate >= this.options.step / this.rangeKo || coordinate - move >= this.options.step / this.rangeKo) {
        startCoordinates = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      }
    };

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        const onClickPreventDefault = (evt) => {
          evt.preventDefault();
          pin.getDomElement().removeEventListener('click', onClickPreventDefault)
        };
        pin.getDomElement().addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  changeOptions = (options) => {
    const blockId = `#${this.block[0].id}`;
    $(`${blockId} .slider__line`).remove();
    $(`${blockId} .slider__input`).remove();
    // console.log('options', options);
    this.options.step = options.step;
    this.options.min = options.min;
    this.options.max = options.max;
    this.options.pinUp = options.pinUp;
    this.options.orientation = options.orientation;
    this.slider.setMinMax(options.min, options.max);
    this.renderDomElements();
  }
};
