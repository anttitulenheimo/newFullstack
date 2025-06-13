const Header = ({ name }) => {
    return (
      <div>
        <h1>
          {name}
        </h1>
      </div>
    )
}

const Part = ({ part }) => {
    return (
        <div>
        <p>
            {part.name} {part.exercises}
        </p>
        </div>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
            <Part key={part.id} part={part}>
            </Part>
            )}
        </div>
    )
}

const Total = ( { parts }) => {

    const totalExcercises = parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <div>
        <p><strong> total of exercises {totalExcercises}  </strong></p>
        </div>
    )
}


const Course = ({ course }) => {
    return (
        <div>
          <Header name={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts}/>
        </div>
    )
}

export default Course