import { test, expect } from '@playwright/test'
//import { TodoPage } from '../../pages/toDoPage'

test.describe('ToDo List Tests', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('https://www.techglobal-training.com/frontend/project-6')
   });   
    
test('Test Case 01 - Todo-App Modal Verification', async({page}) => {

  const toDoModal = page.locator('.panel');
  await expect(toDoModal).toBeVisible()
  const toDoModalTitle = page.locator('.panel > p')
  await expect(toDoModalTitle).toHaveText('My Tasks')
  const newTodoInput = page.locator('#input-add'); 
  await expect(newTodoInput).toBeEnabled()
  const addButton = page.locator('#add-btn'); 
  await expect(addButton).toBeEnabled()
  const searchField = page.locator('#search');
  await expect(searchField).toBeEnabled();
  
  const emptyTaskList = page.locator('.todo-item');
  await expect(emptyTaskList).toHaveText("No tasks found!");
});

test('Test Case 02 - Single Task Addition and Removal', async({page}) => {
  
  const newTodoInput = page.locator('#input-add'); 
  const taskText = 'Finish Homework';
  await newTodoInput.fill(taskText);
  
  const addButton = page.locator('#add-btn'); 
  await addButton.click();

  const taskList = page.locator('.todo-item:not(.has-text-danger)'); 
  await expect(taskList).toHaveCount(1);
  
  await expect(taskList.first()).toHaveText(taskText);

  await taskList.first().click(); 
  
  const markedItem = page.locator('.panel-icon').first()
  await expect(markedItem).toBeVisible();

  const removeButton = page.locator('.panel-icon').last(); 
  await removeButton.click();

  const emptyTaskList = page.locator('.todo-item');
  await expect(emptyTaskList).toHaveText("No tasks found!");
});

test('Test Case 03 - Multiple Task Operations', async ({ page }) => {
 
  const toDoItems = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
  
  const newTodoInput = page.locator('#input-add');  

  for (const item of toDoItems) {
    await newTodoInput.fill(item);
    await page.locator('#add-btn').click();
  }

  for (const item of toDoItems) {
    await expect(page.locator(`text=${item}`)).toHaveText(`${item}`);
  }

  for (const item of toDoItems) {
    await page.locator(`text=${item}`).click(); 
  }
  
  await page.click('button#clear'); 
  await expect(page.locator('.todo-item')).toHaveText("No tasks found!");
 });
 
test('Test Case 04 - Search and Filter Functionality in todo App', async ({ page }) => {

  const toDoItems = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
  
  const newTodoInput = page.locator('#input-add');  

  for (const item of toDoItems) {
    await newTodoInput.fill(item);
    await page.locator('#add-btn').click();
  }

  for (const item of toDoItems) {
    await expect(page.locator(`text=${item}`)).toBeVisible();
  }

  const searchItem = toDoItems[1]; 
  await page.fill('#search', searchItem); 

  expect(page.locator(`text=${searchItem}`)).toBeVisible();
  await expect(page.locator('.todo-item:not(.has-text-danger)')).toHaveCount(1);
});

test('Test Case 05 - Task Validation and Error Handling', async ({ page }) => {

await page.fill('#input-add', ''); 
await page.click('#add-btn');
await expect(page.locator('.todo-item')).toHaveText("No tasks found!");

const invalidItemName = 'A'.repeat(31); 
await page.fill('#input-add', invalidItemName); 
await page.click('#add-btn');
await expect(page.locator('.notification')).toHaveText("Error: Todo cannot be more than 30 characters!");

const validItemName = 'Task 1'; 
await page.fill('#input-add', validItemName);
await page.click('#add-btn');

await expect(page.locator('.todo-item:not(.has-text-danger)')).toHaveCount(1);

await page.fill('#input-add', validItemName);
await page.click('#add-btn');
await expect(page.locator('.notification')).toHaveText(`Error: You already have ${validItemName} in your todo list.`);
});

});