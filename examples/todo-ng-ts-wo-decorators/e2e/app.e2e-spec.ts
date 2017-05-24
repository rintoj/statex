import { TodoNgTsPage } from './app.po';

describe('todo-ng-ts App', () => {
  let page: TodoNgTsPage;

  beforeEach(() => {
    page = new TodoNgTsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
