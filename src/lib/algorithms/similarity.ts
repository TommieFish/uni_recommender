//cosine - measure similarity in angle betwewen 2 vectors.
export function cosineSimilarity(student : number[], university : number[]) : number
{
  //angle if found through the formula: θ = (a ⋅ b) / |a| * |b|
    //Where |a| and |b| are the roots of the sum of the squares of a and b.  

  const dotProduct = student.reduce((sum : number, currentValue: number, index: number) => sum + (currentValue * university[index]), 0); // dot product (a ⋅ b) 
  const studentSumSquares = student.reduce((sum : number, currentValue : number) => sum + (currentValue * currentValue), 0); //sum of all squares for student (|a|)
  const universitySumSquares = university.reduce((sum : number, currentValue : number) => sum + (currentValue * currentValue), 0); //sum of all squares for uni (|b|)

  const magnitudeStudent = Math.sqrt(studentSumSquares);
  const magnitudeUni = Math.sqrt(universitySumSquares);

  return dotProduct / (magnitudeStudent * magnitudeUni);  
}

//my specialised function to calc grade surplus, where a higher surplus (above entry reqs) = a higher return
export function gradeSimilarity(student : number[], university: number[], gradeWeight: number): number
{
  //grades are the first item in vectors (all in Ucas points). studentGrade always >= uniGrade, as filtered beforehand
  const studentGrade : number = student[0];
  const universityGrade : number = university[0];

  if (studentGrade < universityGrade)
  {
    return 0;
  }


  const gradeExcess :number = studentGrade - universityGrade;
  let relativeSurplus : number = (gradeExcess / universityGrade) + 0.1;


  if (universityGrade >= (152 / 3) * gradeWeight) //A*AA, further inc
  {
    relativeSurplus += 0.125;
  }
  else if (universityGrade >= (114 / 3) * gradeWeight) //above AAA, give extra weight
  {
    relativeSurplus += 0.1;
  }

  const cappedExcess : number = Math.min(relativeSurplus , 0.9); //cap at +90% (as ultra low unis can still have a massive boost, but want to give safety, but not too much so higher are filtered out)

  const difficultyWeight : number = Math.pow((universityGrade / ((72/3) * gradeWeight)), 4.5) //harder grades worth more due to exponential. Use lowest offer could find (DDD) for stem related courses (as majority are stem courses, and similar for other) and exponent od 1.5
  const weightedEXcess: number = (cappedExcess * difficultyWeight) / 45; //divide by max possible (0.9  * 10) to normalise to 0-1 range

  return weightedEXcess;

}

export function euclideanDistance(student : number[], university: number[]) : number
{
  const squaredDifferences = student.reduce((sum:number, value: number, index : number) => sum + ((value - university[index]) ** 2), 0) //gets distnace squared for each value and sums them
  return Math.sqrt(squaredDifferences); //magnitude
}