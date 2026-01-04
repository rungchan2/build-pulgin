import ts from 'typescript';
import type { PropInfo } from '../types';

/**
 * React 컴포넌트의 Props 정보를 추출하는 클래스
 */
export class PropsExtractor {
  /**
   * SourceFile에서 Props 정보 추출
   */
  extract(sourceFile: ts.SourceFile): PropInfo[] {
    const props: PropInfo[] = [];

    // Props 타입/인터페이스 찾기
    const propsType = this.findPropsType(sourceFile);
    if (propsType) {
      props.push(...this.extractFromTypeNode(propsType, sourceFile));
    }

    // 함수 매개변수에서 직접 추출 (destructuring 패턴)
    const componentFunction = this.findComponentFunction(sourceFile);
    if (componentFunction) {
      props.push(
        ...this.extractFromFunctionParams(componentFunction, sourceFile)
      );
    }

    return this.deduplicateProps(props);
  }

  /**
   * Props 타입 정의 찾기
   */
  private findPropsType(
    sourceFile: ts.SourceFile
  ): ts.TypeNode | ts.InterfaceDeclaration | undefined {
    let propsType: ts.TypeNode | ts.InterfaceDeclaration | undefined;

    ts.forEachChild(sourceFile, (node) => {
      // interface ComponentProps { ... }
      if (
        ts.isInterfaceDeclaration(node) &&
        node.name.text.endsWith('Props')
      ) {
        propsType = node;
      }

      // type ComponentProps = { ... }
      if (
        ts.isTypeAliasDeclaration(node) &&
        node.name.text.endsWith('Props')
      ) {
        propsType = node.type;
      }
    });

    return propsType;
  }

  /**
   * 컴포넌트 함수 찾기
   */
  private findComponentFunction(
    sourceFile: ts.SourceFile
  ): ts.FunctionLikeDeclaration | undefined {
    let component: ts.FunctionLikeDeclaration | undefined;

    ts.forEachChild(sourceFile, (node) => {
      // export default function Component() / export function Component()
      if (ts.isFunctionDeclaration(node) && this.isExported(node)) {
        component = node;
      }

      // const Component = () => {}
      if (ts.isVariableStatement(node) && this.isExported(node)) {
        for (const decl of node.declarationList.declarations) {
          if (
            decl.initializer &&
            (ts.isArrowFunction(decl.initializer) ||
              ts.isFunctionExpression(decl.initializer))
          ) {
            component = decl.initializer;
          }
        }
      }
    });

    return component;
  }

  /**
   * 타입 노드에서 Props 추출
   */
  private extractFromTypeNode(
    typeNode: ts.TypeNode | ts.InterfaceDeclaration,
    sourceFile: ts.SourceFile
  ): PropInfo[] {
    const props: PropInfo[] = [];

    // InterfaceDeclaration
    if (ts.isInterfaceDeclaration(typeNode)) {
      for (const member of typeNode.members) {
        const propInfo = this.extractMemberProp(member, sourceFile);
        if (propInfo) {
          props.push(propInfo);
        }
      }
      return props;
    }

    // TypeLiteral: { prop: type }
    if (ts.isTypeLiteralNode(typeNode)) {
      for (const member of typeNode.members) {
        const propInfo = this.extractMemberProp(member, sourceFile);
        if (propInfo) {
          props.push(propInfo);
        }
      }
    }

    // IntersectionType: PropsA & PropsB
    if (ts.isIntersectionTypeNode(typeNode)) {
      for (const type of typeNode.types) {
        props.push(...this.extractFromTypeNode(type, sourceFile));
      }
    }

    return props;
  }

  /**
   * 타입 멤버에서 PropInfo 추출
   */
  private extractMemberProp(
    member: ts.TypeElement,
    sourceFile: ts.SourceFile
  ): PropInfo | null {
    if (!ts.isPropertySignature(member)) {
      return null;
    }

    const name = member.name;
    if (!ts.isIdentifier(name) && !ts.isStringLiteral(name)) {
      return null;
    }

    const propName = ts.isIdentifier(name) ? name.text : name.text;
    const required = !member.questionToken;
    const type = member.type ? member.type.getText(sourceFile) : 'any';

    return {
      name: propName,
      type,
      required,
    };
  }

  /**
   * 함수 매개변수에서 Props 추출
   */
  private extractFromFunctionParams(
    func: ts.FunctionLikeDeclaration,
    sourceFile: ts.SourceFile
  ): PropInfo[] {
    const props: PropInfo[] = [];
    const firstParam = func.parameters[0];

    if (!firstParam) return props;

    // Destructuring: function Component({ prop1, prop2 })
    if (ts.isObjectBindingPattern(firstParam.name)) {
      for (const element of firstParam.name.elements) {
        if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
          props.push({
            name: element.name.text,
            type: 'unknown',
            required: !element.initializer,
            defaultValue: element.initializer?.getText(sourceFile),
          });
        }
      }
    }

    return props;
  }

  /**
   * export 키워드가 있는지 확인
   */
  private isExported(node: ts.Node): boolean {
    const modifiers = ts.canHaveModifiers(node)
      ? ts.getModifiers(node)
      : undefined;
    return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false;
  }

  /**
   * 중복 Props 제거
   */
  private deduplicateProps(props: PropInfo[]): PropInfo[] {
    const seen = new Set<string>();
    return props.filter((prop) => {
      if (seen.has(prop.name)) return false;
      seen.add(prop.name);
      return true;
    });
  }
}

export const propsExtractor = new PropsExtractor();
