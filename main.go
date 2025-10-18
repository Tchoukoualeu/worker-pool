package main

import (
	"fmt"
	"sync"
	"time"
)

type Task string

func main() {

	tasks:= make(chan Task, 10)

	var wg sync.WaitGroup

	numberOfWorkers := 3

	for i := 1; i <= numberOfWorkers; i++ {
		wg.Add(1)
		go worker(i, tasks, &wg)
	}

	go func(){
		for i := 1; i < 20; i++ {
			task := Task(fmt.Sprintf("Task -%d: Process data", i))
			tasks <- task
			fmt.Printf("Produced: %s\n", task)
			time.Sleep(500 * time.Millisecond)
		}

		close(tasks)
	}()

	wg.Wait()
	fmt.Println("All tasks completed!")
}

func worker(id int, tasks chan Task, wg *sync.WaitGroup){
	defer wg.Done()

	for task := range tasks {
		fmt.Printf("worker %d starting %s\n", id, task)
		time.Sleep(1* time.Second)
		fmt.Printf("worker %d completed %s\n", id, task)
	}

}