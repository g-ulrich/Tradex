import { ColorType, LineStyle, CrosshairMode } from 'lightweight-charts';

export const seriesColors = {
  red: {line: 'rgba(237,66,69, 1)',
  bottom: 'rgba(237,66,69, 0.04)',
  top: 'rgba(237,66,69, 0.56)'},
  green: {line: 'rgba(87,242,135, 1)',
  bottom: 'rgba(87,242,135, 0.04)',
  top: 'rgba(87,242,135, 0.56)'}
}

export const chartColors = {
    white: '#ffffff',
    softDarkGray: 'rgba(49,53,59, 0.9)',
    softWhite: 'rgba(100,100,100, 0.4)',
    softRed: 'rgba(200, 97, 100, .5)',
    softGreen: 'rgba(39, 157, 130, .5)',
    discord: {
      red: '#ED4245',
      softRed: 'rgba(237,66,69,.5)',
      green: 'rgb(87,242,135)',
      softGreen: 'rgba(87,242,135, .5)',
      white: '#f2f3f5',
      white2: '#d9dadc',
      blurple: '#7289DA',
      blurple2: '#5865f2',
      softBlurple2: 'rgba(88,101,242,.2)',
      darkGray: '#424549',
      darkerGray: '#36393E',
      darkestGray: '#282B30',
      black: '#1E2124',
    }
  }


export const CHART_THEMES = {
  defaultSeries : {
    lineWidth: .5,
  },
  percentPriceLine : {
    lineWidth: 1,
    lineStyle: LineStyle.Dotted,
    axisLabelVisible: true,
    lineVisible: false
  },
  simpleChart : {
    layout: {
      textColor: chartColors.white,
      background: {
          color: chartColors.discord.darkestGray,
          type: ColorType.Solid,
      },
      fontSize: 12,
    },
    rightPriceScale: { visible: false},
    timeScale: {visible: false},
    crosshair: {
      visible: false,
      mode: CrosshairMode.Hidden,
      vertLine: {visible: false },
      horzLine: {visible: false },
  },
    grid: {vertLines: {visible: false}, horzLines: {visible: false}},
    handleScroll: false,
    handleScale: false
  },
  defaultChart : {
    layout: {
      textColor: chartColors.white,
      background: {
          color: chartColors.discord.darkestGray,
          type: ColorType.Solid,
      },
      fontSize: 12,
    },
    rightPriceScale: {
      visible: true,
      scaleMargins: { top: 0.2, bottom: 0.2 },
    },
    timeScale: { timeVisible: true, secondsVisible: false },
    crosshair: {
      mode: CrosshairMode.FinanceChart,
      vertLine: {
          labelBackgroundColor: chartColors.discord.darkerGray,
      },
      horzLine: {
          labelBackgroundColor: chartColors.discord.darkerGray,
      },
    },
    grid: {
      vertLines: {visible: true, color: chartColors.softDarkGray },
      horzLines: {visible: true, color: chartColors.softDarkGray },
    },
    handleScroll: { vertTouchDrag: true },
  }
};

export const defaultSimpleChartOptions = (opts) => {
  return {
    width: opts?.width || 500,
    height: opts?.height || 500,
    layout: {
        textColor: chartColors.white,
        background: {
            color: chartColors.discord.darkestGray,
            type: ColorType.Solid,
        },
        fontSize: 12,
    },
    rightPriceScale: { visible: opts?.rightPriceScale?.visible || false},
    timeScale: { visible: opts?.timeScale?.visible || false},
    crosshair: {
        visible: opts?.crosshair?.visible || false,
        mode: opts?.crosshair?.visible ? CrosshairMode.FinanceChart : CrosshairMode.Hidden,
        vertLine: {visible: opts?.crosshair?.visible || false },
        horzLine: {visible: opts?.crosshair?.visible || false },
    },
    grid: {
        vertLines: { visible: false,color: chartColors.softDarkGray },
        horzLines: { visible: false,color: chartColors.softDarkGray },
    },
    handleScroll: opts?.handleScroll || true,
    handleScale: opts?.handleScale || true,
  }
}

export const defaultChartOptions = (opts) => {
  return {width: opts?.width || 500,
    height: opts?.height || 500,
    layout: {
        textColor: chartColors.white,
        background: {
            color: chartColors.discord.darkestGray,
            type: ColorType.Solid,
        },
        fontSize: 12,
    },
    rightPriceScale: {
        scaleMargins: { top: 0.2, bottom: 0.2 },
    },
    timeScale: { timeVisible: true, secondsVisible: false },
    crosshair: {
        mode: CrosshairMode.FinanceChart,
        vertLine: {
            labelBackgroundColor: chartColors.discord.darkerGray,
        },
        horzLine: {
            labelBackgroundColor: chartColors.discord.darkerGray,
        },
    },
    grid: {
        vertLines: { color: chartColors.softDarkGray },
        horzLines: { color: chartColors.softDarkGray },
    },
    handleScroll: { vertTouchDrag: true },
  }
};
