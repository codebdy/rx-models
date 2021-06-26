export class TreeCommand {
  do(models: any[]) {
    const roots = [];
    const leftModels = [];
    for (const model of models) {
      if (!model.parent) {
        roots.push(model);
      } else {
        leftModels.push(model);
      }
    }

    for (const child of roots) {
      this.buildChildren(child, leftModels);
    }
    return roots;
  }

  private buildChildren(parentModel: any, models: any[]) {
    parentModel.children = [];
    const leftModels = [];
    for (const model of models) {
      if (model.parent?.id && model.parent.id === parentModel.id) {
        parentModel.children.push(model);
        delete model.parent;
      } else {
        leftModels.push(model);
      }
    }

    for (const child of parentModel.children) {
      this.buildChildren(child, leftModels);
    }
  }
}
