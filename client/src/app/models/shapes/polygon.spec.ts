import { MAX_POLY_EDGES, MIN_POLY_EDGES, Polygon } from './polygon';

describe('Polygon', () => {
  let polygon: Polygon;
  beforeEach(() => {
    polygon = new Polygon();
  });
  it('should create an instance', () => {
    expect(polygon).toBeTruthy();
  });
  it('should be at MIN_POLY_EDGE in lower edge case', () => {
    polygon.nEdges = 2;
    expect(polygon.nEdges).toBe(MIN_POLY_EDGES);
  });
  it('should be at MAX_POLY_EDGE in higher edge case', () => {
    polygon.nEdges = MAX_POLY_EDGES + 1;
    expect(polygon.nEdges).toBe(MAX_POLY_EDGES);
  });
  it('should be at MIN_POLY_EDGE in unexpected cases', () => {
    polygon.nEdges = NaN;
    expect(polygon.nEdges).toBe(MIN_POLY_EDGES);
  });
  it('Should init with interiorAngle at 2Pi/ nEdges', () => {
    expect(polygon.interiorAngle).toBe((2 * Math.PI) / polygon.nEdges);
  });
  it('Should change internal angle on nEdges change', () => {
    const initialAngle = polygon.interiorAngle;
    polygon.nEdges = 2 * MIN_POLY_EDGES;
    expect(polygon.interiorAngle !== initialAngle).toBe(true);
    expect(polygon.interiorAngle).toBe(Math.PI / MIN_POLY_EDGES);
  });
  it('should have positive height value on negative input', () => {
    polygon.height = -1;
    expect(polygon.height).toBe(1);
  });
  it('should have positive width value on negative input', () => {
    polygon.width = -1;
    expect(polygon.width).toBe(1);
  });
  it('Should have is center at half width and half height', () => {
    polygon.width = 1;
    polygon.height = 1;
    expect(polygon.center.x).toBe(1 / 2);
    expect(polygon.center.y).toBe(1 / 2);
  });
});
