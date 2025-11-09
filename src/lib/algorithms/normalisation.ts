//Defines normalisation strategies
export type NormalisationMethod = "minmax" | "minmax_student" | "log" | "none";

/**
 * Each method transforms input array into vector of scaled arrays (generally into a smaller range)
 * 
 * @param {number[]} values - Un-normalised vector
 * @param {NormalisationMethod} method - Normalisation to apply
 * @returns {number[]} - Normalised vector
 */

/**
 * What each method is best used for & how they work:
 *  1) Minmax - features with known, bounded ranges (like distance). Maps values to [0, 1] range (but if only 1 value, then will be zero)
 *  2) Minmax_student - maps values to [0, 1] range for n-1 values, then student distance normalised so no impact on scale but student value is normalised in the same way as the uni vectors are
 *  3) Log - compresses large ranges (such as total fees, which are in the range of tens of thousands of poundss)
 */

export function normalise(values : number[], method: NormalisationMethod) : number[]
{
  console.log(`Normalising wit ${method} method.`);

  switch(method)
  {
    case "minmax":
    {
      const min: number = Math.min(...values);
      const max: number = Math.max(...values);
      const range: number = max - min;

      //no division by zero
      if (range ===0)
      {
        return values.map(() => 0); //return zero
      }
      const minmax : number[] = values.map(value => (value - min) / range);  //scale to [1,0]
      return minmax;
    }

    case "minmax_student":
    {
      const len : number = values.length;
      if(len < 2) return [0]; //as one value will be student distance, and need more than 1 other item for minmax to work (not return zero)

      const cutoff : number[] = values.slice(0, len-1)
      const studentDistance : number= values[len - 1];

      const min: number = Math.min(...cutoff);
      const max: number = Math.max(...cutoff);
      const range: number = max - min;

      if (range === 0) //no division by zero
      {
        return [0];
      }

      console.log("Student distance : ", studentDistance, "min:", min, "range:", range)
      const normalisedStudentDistance : number = (studentDistance - min) / range;
      return [normalisedStudentDistance];
    }

    case "log":
    {
      //compresses large values (x>1) and expands small ones (0<x<1). Adding one avoids log(0), no effect on relative scaling
      return values.map(value => Math.log(value + 1));
    }

    case "none":
    {
      return values;
    }
    
    default:
    {
      return [...values];
    }
  }
}