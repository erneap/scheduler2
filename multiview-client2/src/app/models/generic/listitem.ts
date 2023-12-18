export class ListItem {
  public id: string = '';
  public label: string = '';
  sortid: number = 0;
  public selected: boolean = false;

  constructor(
    id: string,
    label: string,
    sort?: number
  ) {
    this.id = id;
    this.label = label;
    if (sort) {
      this.sortid = sort;
    }
    this.selected = false;
  }

  compareTo(other?: ListItem): number {
    if (other) {
      return (this.sortid < other.sortid) ? -1 : 1;
    }
    return -1;
  }

  toggle(): void {
    this.selected = !this.selected;
  }

  select(): void {
    this.selected = true;
  }

  unselect(): void {
    this.selected = false;
  }
}