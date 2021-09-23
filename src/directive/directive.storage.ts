import { Injectable, OnModuleInit } from '@nestjs/common';
import { importDirectivesFromDirectories } from 'util/DirectoryExportedDirectivesLoader';
import { DirectiveType } from './directive-type';
import { DeleteDirectiveClass } from './delete/delete.directive.class';
import { PostDirectiveClass } from './post/post.directive.class';
import { QueryDirectiveClass } from './query/query.directive.class';
import { QueryConditionDirectiveClass } from './query/query.condition-directive-class';
import { QueryRelationDirectiveClass } from './query/query.relation-directive-class';
import { QueryFieldDirectiveClass } from './query/query.field-directive.class';

@Injectable()
export class DirectiveStorage implements OnModuleInit {
  queryEntityDirectiveClasses: {
    [key: string]: QueryDirectiveClass;
  } = {} as any;
  queryRelationDirectiveClasses: {
    [key: string]: QueryRelationDirectiveClass;
  } = {} as any;
  queryConditionDirectiveClasses: {
    [key: string]: QueryConditionDirectiveClass;
  } = {} as any;
  queryFieldDirectiveClasses: {
    [key: string]: QueryFieldDirectiveClass;
  } = {} as any;

  postEntityDirectiveClasses: { [key: string]: PostDirectiveClass } = {} as any;
  postRelationDirectiveClasses: {
    [key: string]: PostDirectiveClass;
  } = {} as any;

  deleteDirectiveClasses: { [key: string]: DeleteDirectiveClass } = {} as any;

  async onModuleInit() {
    await this.loadDirectiveClasses();
  }

  async loadDirectiveClasses() {
    const directiveClasses: QueryDirectiveClass[] | PostDirectiveClass[] =
      importDirectivesFromDirectories([
        'dist/directives/*.js',
        'directives/*.js',
      ]);
    directiveClasses.forEach((directiveClass) => {
      const directiveName = directiveClass.directiveName;
      if (
        directiveClass.directiveType === DirectiveType.QUERY_ENTITY_DIRECTIVE
      ) {
        console.assert(
          !this.queryEntityDirectiveClasses[directiveName],
          `Query entity directive ${directiveName} duplicated!`,
        );
        this.queryEntityDirectiveClasses[directiveName] = directiveClass;
      }

      if (
        directiveClass.directiveType === DirectiveType.QUERY_RELATION_DIRECTIVE
      ) {
        console.assert(
          !this.queryRelationDirectiveClasses[directiveName],
          `Query relation directive ${directiveName} duplicated!`,
        );
        this.queryRelationDirectiveClasses[directiveName] = directiveClass;
      }

      if (
        directiveClass.directiveType === DirectiveType.QUERY_CONDITION_DIRECTIVE
      ) {
        console.assert(
          !this.queryConditionDirectiveClasses[directiveName],
          `Query condition directive ${directiveName} duplicated!`,
        );
        this.queryConditionDirectiveClasses[directiveName] = directiveClass;
      }

      if (
        directiveClass.directiveType === DirectiveType.QUERY_FIELD_DIRECTIVE
      ) {
        console.assert(
          !this.queryFieldDirectiveClasses[directiveName],
          `Query field directive ${directiveName} duplicated!`,
        );
        this.queryFieldDirectiveClasses[directiveName] = directiveClass;
      }

      if (
        directiveClass.directiveType === DirectiveType.POST_ENTITY_DIRECTIVE
      ) {
        console.assert(
          !this.postEntityDirectiveClasses[directiveName],
          `Post entity directive ${directiveName} duplicated!`,
        );
        this.postEntityDirectiveClasses[directiveName] = directiveClass;
      }

      if (
        directiveClass.directiveType === DirectiveType.POST_RELATION_DIRECTIVE
      ) {
        console.assert(
          !this.postRelationDirectiveClasses[directiveName],
          `Post relation directive ${directiveName} duplicated!`,
        );
        this.postRelationDirectiveClasses[directiveName] = directiveClass;
      }
      if (directiveClass.directiveType === DirectiveType.DELETE_DIRECTIVE) {
        console.assert(
          !this.deleteDirectiveClasses[directiveName],
          `Delete directive ${directiveName} duplicated!`,
        );
        this.deleteDirectiveClasses[directiveName] = directiveClass;
      }
    });
    console.debug('Directives loaded');
  }
}
