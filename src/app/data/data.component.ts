import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  canvas?: ElementRef<HTMLCanvasElement>;

  // @ts-ignore
  private ctx: CanvasRenderingContext2D;

  //public context: CanvasRenderingContext2D | undefined;
  private width = 360;
  private height = 360;
  private markWidth = 5;
  private arrowSize = 5;
  private rSize = 60;
  private figureColor = '#39f';
  save: string = "auth/save/attempt";
  get: string = "auth/list";
  fromGraph: string = "auth/save/attempt/from_graph";
  isxError: boolean = false;
  isyError: boolean = false;
  isrError: boolean = false;
  jwt: string = "";
  x: number = 0;
  y: number = 0;
  r: number = 3;
  data: Array<any> = [];

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  drawFigure(ctx: CanvasRenderingContext2D, width: number, height: number, rSize: number) {
    ctx.clearRect(0, 0, width, height);
    ctx.font = '20px monospace';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.beginPath();
    ctx.fillStyle = '#39f';
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2 - rSize * 2, height / 2);
    ctx.lineTo(width / 2 - rSize * 2, height / 2 + rSize);
    ctx.lineTo(width / 2, height / 2 + rSize);
    ctx.lineTo(width / 2, height / 2);
    ctx.fill();
    ctx.moveTo(width / 2 - rSize * 2, height / 2);
    ctx.lineTo(width / 2, height / 2);
    ctx.lineTo(width / 2, height / 2 - rSize * 2);
    ctx.arc(width / 2, height / 2, rSize * 2, Math.PI, Math.PI * 3 / 2);
    ctx.fill();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2, height / 2 - rSize * 2);
    ctx.lineTo(width / 2 + rSize * 2, height / 2);
    ctx.lineTo(width / 2, height / 2);
    ctx.fill();
  }

  drawPane(ctx: CanvasRenderingContext2D, width: number, height: number, rSize: number, markWidth: number, arrowSize: number) {
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.moveTo(width / 2, height / 2)
    ctx.lineTo(0, height / 2)
    ctx.moveTo(width / 2, height / 2)
    ctx.lineTo(width / 2, height)
    ctx.moveTo(width / 2, height / 2)
    ctx.lineTo(width / 2, 0)
    ctx.moveTo(width / 2 + rSize, height / 2 + markWidth)
    ctx.lineTo(width / 2 + rSize, height / 2 - markWidth)
    ctx.moveTo(width / 2 + rSize * 2, height / 2 + markWidth)
    ctx.lineTo(width / 2 + rSize * 2, height / 2 - markWidth)
    ctx.moveTo(width / 2 - rSize, height / 2 + markWidth)
    ctx.lineTo(width / 2 - rSize, height / 2 - markWidth)
    ctx.moveTo(width / 2 - rSize * 2, height / 2 + markWidth)
    ctx.lineTo(width / 2 - rSize * 2, height / 2 - markWidth)
    ctx.moveTo(width / 2 + markWidth, height / 2 + rSize)
    ctx.lineTo(width / 2 - markWidth, height / 2 + rSize)
    ctx.moveTo(width / 2 + markWidth, height / 2 + rSize * 2)
    ctx.lineTo(width / 2 - markWidth, height / 2 + rSize * 2)
    ctx.moveTo(width / 2 + markWidth, height / 2 - rSize)
    ctx.lineTo(width / 2 - markWidth, height / 2 - rSize)
    ctx.moveTo(width / 2 + markWidth, height / 2 - rSize * 2)
    ctx.lineTo(width / 2 - markWidth, height / 2 - rSize * 2)
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2 + arrowSize, arrowSize)
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2 - arrowSize, arrowSize)
    ctx.moveTo(width, height / 2)
    ctx.lineTo(width - arrowSize, height / 2 + arrowSize)
    ctx.moveTo(width, height / 2)
    ctx.lineTo(width - arrowSize, height / 2 - arrowSize)
    ctx.moveTo(width / 2, height / 2)
    ctx.font = '20px monospace'
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center';
    ctx.fillText('-R/2', width / 2 - rSize, height * 8 / 17)
    ctx.fillText('-R', width / 2 - rSize * 2, height * 8 / 17)
    ctx.fillText('R/2', width / 2 + rSize, height * 8 / 17)
    ctx.fillText('R', width / 2 + rSize * 2, height * 8 / 17)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('-R/2', width * 9 / 17, width / 2 + rSize)
    ctx.fillText('-R', width * 9 / 17, width / 2 + rSize * 2)
    ctx.fillText('R/2', width * 9 / 17, width / 2 - rSize)
    ctx.fillText('R', width * 9 / 17, width / 2 - rSize * 2)
    ctx.font = '15px monospace'
    ctx.fillText('y', width * 9 / 17, arrowSize * 2)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText('x', width - arrowSize, height * 8 / 17)
    ctx.stroke()
    ctx.textAlign = 'center';
    ctx.font = '20px monospace'
    ctx.fillStyle = '#000'
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.jwt = params['jwt'];
    });
    console.log(this.jwt)
    this.send(this.get, 0, 0);
  }

  doSome(event: any): void {
    const r = this.r;
    if (isNaN(Number(r)) || Number(r) > 5 || Number(r) < 3) {
      this.isrError = true;
    } else {
      this.isrError = false;
      const rVal: number = Number(r);
      const x = ((event.offsetX - 180) / (this.rSize * 2)) * rVal;
      const y = ((-event.offsetY + 180) / (this.rSize * 2)) * rVal;
      this.send(this.fromGraph, x, y);
      console.log(this.r);
    }
  }

  reloadGraph(response: any): void {
    // @ts-ignore
    let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    let width = this.width;
    let height = this.height;
    let rSize = this.rSize;
    let markWidth = this.markWidth;
    let arrowSize = this.arrowSize;
    this.drawFigure(ctx, width, height, rSize);
    this.drawPane(ctx, width, height, rSize, markWidth, arrowSize);
    for (let i = 0; i < response.length; i++) {
      let realR = this.r;
      let realX = (response[i].x / response[i].r * 120) + 180;
      if (realX > 180) {
        realX = 180 + (realX - 180) * (response[i].r / realR);
      } else {
        realX = 180 - ((180 - realX) * (response[i].r / realR));
      }
      let realY = ((-response[i].y / response[i].r) * 120) + 180;
      if (realY > 180) {
        realY = 180 + ((realY - 180) * (response[i].r / realR));
      } else {
        realY = 180 - ((180 - realY) * (response[i].r / realR));
      }
      if (response[i].x <= 0 && response[i].y >= 0) {
        if (response[i].x * response[i].x + response[i].y * response[i].y <= realR * realR) {
          ctx.fillStyle = '#0f0';
        } else {
          ctx.fillStyle = '#F00';
        }
      } else if (response[i].x <=0 && response[i].y <= 0) {
        if (response[i].x >= -realR && response[i].y >= -realR / 2) {
          ctx.fillStyle = '#0f0';
        } else {
          ctx.fillStyle = '#F00';
        }
      } else if (response[i].x >= 0 && response[i].y >= 0) {
        ctx.fillStyle = (response[i].y <= (Number(realR)-response[i].x)) ? '#0f0' : '#F00';
      } else {
        ctx.fillStyle = '#F00';
      }
      ctx.beginPath();
      ctx.moveTo(realX, realY);
      ctx.arc(realX, realY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    console.log(response)
  }


  send(method: string, x: number, y: number) {
    this.isxError = false;
    this.isyError = false;
    this.isrError = false;
    if (this.validate() || method === this.get) {
      const body = (method === this.get) ? "" : this.makeDataAttempt(Number(x), Number(y));
      console.log(body);
      this.httpClient.post<any>("http://localhost:8080/" + method, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.jwt
        }
      }).subscribe(
        {
          next: ((response: any) => {
            this.data = response;
            this.reloadGraph(response);
          }),
          error: (error => {
            this.router.navigate(['']);
            console.log(error);
          })
        }
      )
    }
  }

  makeDataAttempt(x: number, y: number): string {
    const data = {
      "x": x,
      "y": y,
      "r": Number(this.r)
    }
    return JSON.stringify(data);
  }

  validate(): boolean {
    let isX = true;
    let isY = true;
    let isR = true;
    if (isNaN(Number(this.x))) {
      isX = false;
      this.isxError = true;
    } else {
      if (Number(this.x) < -3 || Number(this.x) > 5) {
        isX = false;
        this.isxError = true;
      }
    }
    if (isNaN(Number(this.y))) {
      isY = false;
      this.isyError = true;
    } else {
      if (Number(this.y) < -3 || Number(this.y) > 5) {
        isY = false;
        this.isyError = true;
      }
    }
    if (isNaN(Number(this.r))) {
      isR = false;
      this.isrError = true;
    } else {
      if (Number(this.r) < 3 || Number(this.r) > 5) {
        isR = false;
        this.isrError = true;
      }
    }
    return isX && isR && isY;
  }
}

