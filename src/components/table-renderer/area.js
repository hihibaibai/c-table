import Range from './range';
export default class Area {
    constructor(range, x, y, width, height, rowHeight, colWidth) {
        this.range = range;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rowHeight = rowHeight;
        this.colWidth = colWidth;
        this.xOffset = 0;
        this.yOffset = 0;
        // { rowIndex: { y, height }}
        this.rowMap = new Map();
        // { colIndex: { x, width }}
        this.colMap = new Map();
        this.cellAtCache = null;
        // init width, height and set rowMap, colMap
        let totalHeight = 0;
        range.eachRow((index) => {
            const height = rowHeight(index);
            this.rowMap.set(index, { y: totalHeight, height });
            totalHeight += height;
        });
        if (this.height <= 0)
            this.height = totalHeight;
        let totalWidth = 0;
        range.eachCol((index) => {
            const width = colWidth(index);
            this.colMap.set(index, { x: totalWidth, width });
            totalWidth += width;
        });
        if (this.width <= 0)
            this.width = totalWidth;
        // only need offset value for area 4
        if (range.end[0]>0&&range.end[1]>0){
            for (let i = 0; i < range.start[0]; i++){
                const cellHeight = rowHeight(i);
                this.yOffset = this.yOffset + cellHeight;
            }
            for (let i = 0; i < range.start[1]; i++){
                const cellWidth = colWidth(i);
                this.xOffset = this.xOffset + cellWidth;
            }
        }
    }
    /**
     * check whether or not x contained in area
     * @param {int} x offset on x-axis
     */
    containsx(x) {
        return x >= this.x && x < this.x + this.width;
    }
    /**
     * check whether or not y contained in area
     * @param {int} y offset on y-axis
     */
    containsy(y) {
        return y >= this.y && y < this.y + this.height;
    }
    contains(x, y) {
        return this.containsx(x) && this.containsy(y);
    }
    eachRow(callbackFn) {
        this.range.eachRow((index) => {
            const { y, height } = this.rowMap.get(index) || { y: 0, height: 0 };
            if (height > 0)
                callbackFn(index, y, height);
        });
    }
    eachCol(callbackFn) {
        this.range.eachCol((index) => {
            const { x, width } = this.colMap.get(index) || { x: 0, width: 0 };
            if (width > 0)
                callbackFn(index, x, width);
        });
    }
    each(callbackFn) {
        this.eachRow((row, y, height) => {
            this.eachCol((col, x, width) => {
                callbackFn(row, col, { x, y, width, height });
            });
        });
    }
    rectRow(startRow, endRow) {
        var _a;
        const { rowMap, range } = this;
        let [y, height] = [0, 0];
        // row: { y, height }
        if (startRow >= range.startRow) {
            y = ((_a = rowMap.get(startRow)) === null || _a === void 0 ? void 0 : _a.y) || 0;
        }
        for (let i = startRow; i <= endRow; i += 1) {
            const h = this.rowHeight(i);
            if (h > 0) {
                if (i < range.startRow)
                    y -= h;
                height += h;
            }
        }
        const { width } = this;
        return { x: 0, y, width, height };
    }
    rectCol(startCol, endCol) {
        var _a;
        const { colMap, range } = this;
        let [x, width] = [0, 0];
        // col: { x, width }
        if (startCol >= range.startCol) {
            x = ((_a = colMap.get(startCol)) === null || _a === void 0 ? void 0 : _a.x) || 0;
        }
        for (let i = startCol; i <= endCol; i += 1) {
            const w = this.colWidth(i);
            if (w > 0) {
                if (i < range.startCol)
                    x -= w;
                width += w;
            }
        }
        const { height } = this;
        return { x, y: 0, width, height };
    }
    rect(r) {
        let { y, height } = this.rectRow(r.startRow, r.endRow);
        let { x, width } = this.rectCol(r.startCol, r.endCol);
        return { x, y, width, height };
    }
    cellAt(x, y) {
        // whether or not in cache
        const { cellAtCache } = this;
        if (cellAtCache != null) {
            if (x > cellAtCache.x &&
                x <= cellAtCache.x + cellAtCache.width &&
                y > cellAtCache.y &&
                y <= cellAtCache.y + cellAtCache.height) {
                return cellAtCache;
            }
        }
        const { startRow, startCol } = this.range;
        const cell = {
            row: startRow,
            col: startCol,
            x: this.x,
            y: this.y,
            width: 0,
            height: 0,
        };
        // row
        while (cell.y < y) {
            const h = this.rowHeight(cell.row++);
            cell.y += h;
            cell.height = h;
        }
        cell.y -= cell.height;
        cell.row--;
        // col
        while (cell.x < x) {
            const w = this.colWidth(cell.col++);
            cell.x += w;
            cell.width = w;
        }
        cell.x -= cell.width;
        cell.col--;
        this.cellAtCache = cell;
        return cell;
    }
    static create(startRow, startCol, endRow, endCol, x, y, width, height, rowHeight, colWidth) {
        return new Area(new Range(startRow, startCol, endRow, endCol), x, y, width, height, rowHeight, colWidth);
    }
}
