
// create coordinate type
export type Coordinate = {
  x: number;
  y: number;
};

// tolerance for floating point errors
const epsilon = 0.00001;

// create Triangle class
export class Triangle {
  // triangle values
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  // other ambigious case values
  a2: number;
  b2: number;
  c2: number;
  A2: number;
  B2: number;
  C2: number;
  createOtherTriangle: boolean;
  // boolean for valid input
  isValidInput: boolean;
  // boolean for valid completed triangle
  isValid: boolean;
  // boolean for whether triangle is ambigious
  ambiguous: boolean;
  // coordinates for completed triangle
  coords: Coordinate[];
  // coordinates for ambigious case triangle
  coords2: Coordinate[];
  errorMessage: string;

  // constructor to create the triangle object
  constructor(
    a: number = 0,
    b: number = 0,
    c: number = 0,
    A: number = 0,
    B: number = 0,
    C: number = 0,
    createOtherTriangle: boolean = false
  ) {
    this.a = a;
    this.a2 = a;
    this.b = b;
    this.b2 = b;
    this.c = c;
    this.c2 = c;
    this.A = A;
    this.A2 = A;
    this.B = B;
    this.B2 = B;
    this.C = C;
    this.C2 = C;
    this.errorMessage = "";
    this.createOtherTriangle = createOtherTriangle;
    this.isValid = false;
    this.ambiguous = false;
    this.coords = [];
    this.coords2 = [];
    // check for valid input
    this.isValidInput = this.isValidInputForTriangle();
    // solve triangle
    this.completeAndGetCoordinates();
  }

  // function to count data given
  countDataGiven(): number[] {
    let sidesGiven = 0;
    let anglesGiven = 0;

    // count the number of sides given
    if (this.a) {
      sidesGiven++;
    }
    if (this.b) {
      sidesGiven++;
    }
    if (this.c) {
      sidesGiven++;
    }

    // count the number of angles given
    if (this.A) {
      anglesGiven++;
    }
    if (this.B) {
      anglesGiven++;
    }
    if (this.C) {
      anglesGiven++;
    }
    return [sidesGiven, anglesGiven, sidesGiven + anglesGiven];
  }

  // function to check for valid input
  isValidInputForTriangle(): boolean {
    // check for NaN
    if (
      isNaN(this.A) ||
      isNaN(this.B) ||
      isNaN(this.C) ||
      isNaN(this.a) ||
      isNaN(this.b) ||
      isNaN(this.c)
    ) {
      this.errorMessage = "Please enter valid non-zero numbers.";
      return false;
    }

    // check for Negatives
    if (
      this.A < 0 ||
      this.B < 0 ||
      this.C < 0 ||
      this.a < 0 ||
      this.b < 0 ||
      this.c < 0
    ) {
      this.errorMessage = "Please enter positive numbers.";
      return false;
    }

    const dataGiven = this.countDataGiven();
    const sidesGiven = dataGiven[0]
    const totalDataGiven = dataGiven[2];

    // no side lengths given
    if (sidesGiven == 0) {
      this.errorMessage = "Please enter at least one side length.";
      return false;
    }

    // Check for enough data
    if (totalDataGiven !== 3) {
      this.errorMessage = "Please enter exactly three values.";
      return false;
    }

    // Check angles are less than 180 degrees
    if (this.A >= Math.PI || this.B >= Math.PI || this.C >= Math.PI) {
      this.errorMessage = "Angles must be less than 180 degrees.";
      return false;
    }

    // Check for no angles of 0 degrees
    if (
      this.A + this.B === Math.PI ||
      this.A + this.C === Math.PI ||
      this.B + this.C === Math.PI
    ) {
      this.errorMessage = "Sum of angles must be less than 180 degrees, with no angles of 0 degrees.";
      return false;
    }

    // Check sides don't add to eachother
    if (sidesGiven == 3 && 
      ((this.a + this.b <= this.c + epsilon) || 
      (this.b + this.c <= this.a + epsilon) || 
      (this.c + this.a <= this.b + epsilon))
    ) {
      this.errorMessage = "Sum of two sides must not be greater than or equal to the third side."
      return false;
    }

    return true;
  }

  // function to attempt to predict an ambigious case
  isAmbiguous(anglesGiven: number, sidesGiven: number): boolean {
    // If two sides and an angle are given, check for ambiguous case
    if (sidesGiven === 2 && anglesGiven === 1) {
      // if the angle is opposite to the smaller side, predict ambigious
      if (this.a && this.b && this.A && this.a < this.b) {
        return true;
      } else if (this.a && this.c && this.A && this.a < this.c) {
        return true;
      } else if (this.b && this.c && this.B && this.b < this.c) {
        return true;
      } else if (this.c && this.b && this.C && this.c < this.b) {
        return true;
      } else if (this.c && this.a && this.C && this.c < this.a) {
        return true;
      } else if (this.b && this.a && this.B && this.b < this.a) {
        return true;
      }
    }

    return false;
  }

  isValidTriangle(): boolean {
    // check for NaN
    if (
      isNaN(this.A) ||
      isNaN(this.B) ||
      isNaN(this.C) ||
      isNaN(this.a) ||
      isNaN(this.b) ||
      isNaN(this.c)
    ) {
      this.errorMessage = "Invalid triangle, please check your values.";
      return false;
    }

    // check for Negatives
    if (
      this.A < 0 ||
      this.B < 0 ||
      this.C < 0 ||
      this.a < 0 ||
      this.b < 0 ||
      this.c < 0
    ) {
      this.errorMessage = "Invalid triangle, please check your values.";
      return false;
    }

    // check coordinates are valid
    if (
      (this.coords[0].x === this.coords[1].x &&
        this.coords[0].y === this.coords[1].y) ||
      (this.coords[1].x === this.coords[2].x &&
        this.coords[1].y === this.coords[2].y) ||
      (this.coords[0].x === this.coords[2].x &&
        this.coords[0].y === this.coords[2].y)
    ) {
      this.errorMessage = "Invalid triangle, please check your values.";
      return false;
    }

    // check if actually ambiguous
    if (
      (Math.abs(this.a - this.a2) < epsilon &&
        Math.abs(this.b - this.b2) < epsilon &&
        Math.abs(this.c - this.c2) < epsilon) ||
      this.a2 <= 0 ||
      this.b2 <= 0 ||
      this.c2 <= 0
    ) {
      this.ambiguous = false;
    }

    return true;
  }

  // reset triangle without additional updates (not to be used by user)
  lowLevelResetTriangle(): void {
    this.a = 1;
    this.b = 1;
    this.c = 1;
    this.A = 0;
    this.B = 0;
    this.C = 0;
  }

  completeAndGetCoordinates(): Coordinate[] {
    // initialize booleans for logic flow
    let isValidTriangle = false;
    let foundInvalidTriangle = false;
    // If the triangle is not valid, calculate default equallateral triangle instead
    if (this.isValidInput === false) {
      this.lowLevelResetTriangle();
    }

    // make sure triangle is valid before it exits this loop
    while (!isValidTriangle) {
      // if previous iteration resulted in invalid triangle, reset triangle to default/equllateral
      if (foundInvalidTriangle) {
        this.lowLevelResetTriangle();
      }

      const [sidesGiven, anglesGiven] = this.countDataGiven();

      // Predict ambiguous case
      this.ambiguous = this.isAmbiguous(anglesGiven, sidesGiven);

      // If all sides are given, calculate the angles
      if (sidesGiven === 3) {
        this.calculateWithThreeSides();
      }

      // If two angles and a side are given, calculate the missing side and angles
      if (anglesGiven === 2 && sidesGiven === 1) {
        this.calculateWithTwoAnglesAndSide();
      }

      // If two sides and an angle are given, calculate the missing side and angles
      if (sidesGiven === 2 && anglesGiven === 1) {
        this.calculateWithTwoSidesAndAngle();
      }

      // Calculate the coordinates of the points
      const coords: Coordinate[] = [
        { x: 0, y: 0 },
        { x: this.b * Math.cos(this.C), y: this.b * Math.sin(this.C) },
        { x: this.a, y: 0 },
      ];

      // If the triangle is predicted ambiguous, calculate coordinates of the other case
      if (this.ambiguous) {
        const coords2: Coordinate[] = [
          { x: 0, y: 0 },
          { x: this.b2 * Math.cos(this.C2), y: this.b2 * Math.sin(this.C2) },
          { x: this.a2, y: 0 },
        ];
        this.coords2 = coords2;
      } else {
        this.a2 = this.a;
        this.b2 = this.b;
        this.c2 = this.c;
        this.A2 = this.A;
        this.B2 = this.B;
        this.C2 = this.C;
        this.coords2 = coords;
      }

      this.coords = coords;
      // check if triangle is valid
      isValidTriangle = this.isValidTriangle();
      // if triangle is invalid, run another iteration with default/equllateral triangle
      if (!isValidTriangle) {
        foundInvalidTriangle = true;
      }
      this.isValid = !foundInvalidTriangle;
    }
    return this.coords;
  }

  // function to calculate triangle when given 3 sides
  calculateWithThreeSides(): void {
    this.A = this.cosineLawAngle(this.a, this.b, this.c);
    this.B = this.sineLaw(this.b, 0, this.a, this.A);
    this.C = Math.PI - this.A - this.B;
  }
  // Break Case = 3,4,5

  // function to calculate triangle when given 2 angles and a side
  calculateWithTwoAnglesAndSide(): void {
    // Calculate the missing angle
    if (this.A && this.B) {
      this.C = Math.PI - this.A - this.B;
    } else if (this.A && this.C) {
      this.B = Math.PI - this.A - this.C;
    } else if (this.B && this.C) {
      this.A = Math.PI - this.B - this.C;
    }

    // Calculate the missing sides
    if (this.a) {
      this.b = this.sineLaw(0, this.B, this.a, this.A);
      this.c = this.sineLaw(0, this.C, this.a, this.A);
    }
    if (this.b) {
      this.a = this.sineLaw(0, this.A, this.b, this.B);
      this.c = this.sineLaw(0, this.C, this.b, this.B);
    }
    if (this.c) {
      this.a = this.sineLaw(0, this.A, this.c, this.C);
      this.b = this.sineLaw(0, this.B, this.c, this.C);
    }
  }

  // function to calculate triangle when given 2 sides and 1 angle
  calculateWithTwoSidesAndAngle(): void {
    // angle is between the two sides
    if (this.a && this.b && this.C) {
      // calculate missing side
      this.c = this.cosineLawSide(this.a, this.b, this.C);
      // calculate missing angles
      this.A = this.sineLaw(this.a, 0, this.c, this.C);
      this.B = Math.PI - this.A - this.C;
    } else if (this.a && this.c && this.B) {
      // calculate missing side
      this.b = this.cosineLawSide(this.a, this.c, this.B);
      // calculate missing angles
      this.A = this.sineLaw(this.a, 0, this.b, this.B);
      this.C = Math.PI - this.A - this.B;
    } else if (this.b && this.c && this.A) {
      // calculate missing side
      this.a = this.cosineLawSide(this.b, this.c, this.A);
      // calculate missing angles
      this.B = this.sineLaw(this.b, 0, this.a, this.A);
      this.C = Math.PI - this.A - this.B;
    }

    // angle is opposite the side
    else if (this.a && this.b && this.A) {
      // calculate missing angles
      this.B = this.sineLaw(this.b, 0, this.a, this.A);
      this.C = Math.PI - this.A - this.B;
      // calculate missing side
      this.c = this.sineLaw(0, this.C, this.a, this.A);

      // if Triangle is ambiguous, switch the angle
      if (this.ambiguous) {
        // calculate missing angles
        this.B2 = Math.PI - this.B;
        this.C2 = Math.PI - this.A - this.B2;
        // calculate missing side
        this.c2 = this.sineLaw(0, this.C2, this.b2, this.B2);
      }
    } else if (this.a && this.c && this.C) {
      // calculate missing angles
      this.A = this.sineLaw(this.a, 0, this.c, this.C);
      this.B = Math.PI - this.A - this.C;
      // calculate missing side
      this.b = this.sineLaw(0, this.B, this.c, this.C);

      // if Triangle is ambiguous, switch the angle
      if (this.ambiguous) {
        // calculate missing angles
        this.A2 = Math.PI - this.A;
        this.B2 = Math.PI - this.A2 - this.C;
        // calculate missing side
        this.b2 = this.sineLaw(0, this.B2, this.a2, this.A2);
      }
    } else if (this.b && this.c && this.B) {
      // calculate missing angles
      this.C = this.sineLaw(this.c, 0, this.b, this.B);
      this.A = Math.PI - this.B - this.C;
      // calculate missing side
      this.a = this.sineLaw(0, this.A, this.b, this.B);

      // if Triangle is ambiguous, switch the angle
      if (this.ambiguous) {
        // calculate missing angles
        this.C2 = Math.PI - this.C;
        this.A2 = Math.PI - this.B - this.C2;
        // calculate missing side
        this.a2 = this.sineLaw(0, this.A2, this.c2, this.C2);
      }
    } else if (this.c && this.b && this.C) {
      // calculate missing angles
      this.B = this.sineLaw(this.b, 0, this.c, this.C);
      this.A = Math.PI - this.B - this.C;
      // calculate missing side
      this.a = this.sineLaw(0, this.A, this.c, this.C);

      // if Triangle is ambiguous, switch the angle
      if (this.ambiguous) {
        // calculate missing angles
        this.B2 = Math.PI - this.B;
        this.A2 = Math.PI - this.B2 - this.C;
        // calculate missing side
        this.a2 = this.sineLaw(0, this.A2, this.b2, this.B2);
      }
    } else if (this.b && this.a && this.B) {
      // calculate missing angles
      this.A = this.sineLaw(this.a, 0, this.b, this.B);
      this.C = Math.PI - this.A - this.B;
      // calculate missing side
      this.c = this.sineLaw(0, this.C, this.a, this.A);

      // if Triangle is ambiguous, switch the angle
      if (this.ambiguous) {
        // calculate missing angles
        this.A2 = Math.PI - this.A;
        this.C2 = Math.PI - this.A2 - this.B;
        // calculate missing side
        this.c2 = this.sineLaw(0, this.C2, this.a2, this.A2);
      }
    } else if (this.c && this.a && this.A) {
      // calculate missing angles
      this.C = this.sineLaw(this.c, 0, this.a, this.A);
      this.B = Math.PI - this.A - this.C;
      // calculate missing side
      this.b = this.sineLaw(0, this.B, this.a, this.A);

      // if Triangle is ambiguous, switch the angle
      if (this.ambiguous) {
        // calculate missing angles
        this.C2 = Math.PI - this.C;
        this.B2 = Math.PI - this.A - this.C2;
        // calculate missing side
        this.b2 = this.sineLaw(0, this.B2, this.c2, this.C2);
      }
    }
  }

  // Create Sine and Cosine Law Functions
  sineLaw(na: number = 0, nA: number = 0, nb: number, nB: number = 0): number {
    if (!na) {
      return (Math.sin(nA) * nb) / Math.sin(nB);
    }
    return Math.asin((na * Math.sin(nB)) / nb);
  }
  cosineLawAngle(na: number, nb: number, nc: number): number {
    return Math.acos((nb * nb + nc * nc - na * na) / (2 * nb * nc));
  }
  cosineLawSide(na: number, nb: number, nC: number): number {
    return Math.sqrt(na * na + nb * nb - 2 * na * nb * Math.cos(nC));
  }

  // Cycle to the other case
  triangleFlip(): void {
    const olda = this.a;
    const oldb = this.b;
    const oldc = this.c;
    const oldA = this.A;
    const oldB = this.B;
    const oldC = this.C;
    const oldCoords = this.coords;

    this.a = this.a2;
    this.b = this.b2;
    this.c = this.c2;
    this.A = this.A2;
    this.B = this.B2;
    this.C = this.C2;

    this.a2 = olda;
    this.b2 = oldb;
    this.c2 = oldc;
    this.A2 = oldA;
    this.B2 = oldB;
    this.C2 = oldC;

    this.coords = this.coords2;
    this.coords2 = oldCoords;
  }
}