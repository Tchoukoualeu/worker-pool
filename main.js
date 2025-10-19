// Worker Pool Implementation in JavaScript

async function worker(id, tasks) {
  for (const task of tasks) {
    console.log(`worker ${id} starting ${task}`)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log(`worker ${id} completed ${task}`)
  }
}

async function main() {
  const numberOfWorkers = 3
  const totalTasks = 20

  const allTasks = []
  for (let i = 1; i < totalTasks; i++) {
    allTasks.push(`Task ${i}: Process data`)
  }

  // Produce tasks with delay
  const taskQueue = []
  const producer = async () => {
    for (let i = 0; i < allTasks.length; i++) {
      taskQueue.push(allTasks[i])
      console.log(`Produced: ${allTasks[i]}`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Start producer
  producer()

  // Distribute tasks among workers
  const workerPromises = []
  const tasksPerWorker = Math.ceil(allTasks.length / numberOfWorkers)

  for (let i = 0; i < numberOfWorkers; i++) {
    const workerTasks = allTasks.slice(
      i * tasksPerWorker,
      (i + 1) * tasksPerWorker
    )
    workerPromises.push(worker(i + 1, workerTasks))
  }

  // Wait for all workers to complete
  await Promise.all(workerPromises)

  console.log("All tasks completed!")
}

// Run the worker pool
main().catch(console.error)
