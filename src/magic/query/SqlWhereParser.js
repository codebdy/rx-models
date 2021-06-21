'use strict';
import * as Symbol from 'es6-symbol';
import * as TokenizeThis from 'tokenize-this';

/**
 * To distinguish between the binary minus and unary.
 *
 * @type {Symbol}
 */
const OPERATOR_UNARY_MINUS = Symbol('-');

/**
 * Number of operands in a unary operation.
 *
 * @type {number}
 */
const OPERATOR_TYPE_UNARY = 1;

/**
 * Number of operands in a binary operation.
 *
 * @type {number}
 */
const OPERATOR_TYPE_BINARY = 2;

/**
 * Number of operands in a ternary operation.
 *
 * @type {number}
 */
const OPERATOR_TYPE_TERNARY = 3;

/**
 * Defining the use of the unary minus.
 *
 * @type {{operators: [{}], tokenizer: {shouldTokenize: string[], shouldMatch: string[], shouldDelimitBy: string[]}}}
 */
const unaryMinusDefinition = {
  [OPERATOR_UNARY_MINUS]: OPERATOR_TYPE_UNARY,
};

/**
 * A wrapper class around operators to distinguish them from regular tokens.
 */
class Operator {
  constructor(value, type, precedence) {
    this.value = value;
    this.type = type;
    this.precedence = precedence;
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return `${this.value}`;
  }
}

/**
 * The main parser class.
 */
class SqlWhereParser {
  /**
   *
   * @param {{operators: [{}], tokenizer: {shouldTokenize: string[], shouldMatch: string[], shouldDelimitBy: string[]}}} [config]
   */
  constructor(config) {
    if (!config) {
      config = {};
    }

    /**
     *
     * @type {{operators: [{}], tokenizer: {shouldTokenize: string[], shouldMatch: string[], shouldDelimitBy: string[]}}}
     */
    config = Object.assign({}, this.constructor.defaultConfig, config);

    /**
     *
     * @type {TokenizeThis}
     */
    this.tokenizer = new TokenizeThis(config.tokenizer);

    /**
     *
     * @type {{}}
     */
    this.operators = {};

    /**
     * Flattens the operator definitions into a single object,
     * whose keys are the operators, and the values are the Operator class wrappers.
     */
    config.operators.forEach((operators, precedence) => {
      Object.keys(operators)
        .concat(Object.getOwnPropertySymbols(operators))
        .forEach((operator) => {
          this.operators[operator] = new Operator(
            operator,
            operators[operator],
            precedence,
          );
        });
    });
  }

  /**
   *
   * @param {string} sql
   * @param {function} [evaluator]
   * @returns {{}}
   */
  parse(sql, evaluator) {
    const operatorStack = [];
    const outputStream = [];
    let lastOperator = undefined;
    let tokenCount = 0;
    let lastTokenWasOperatorOrLeftParenthesis = false;

    if (!evaluator) {
      evaluator = this.defaultEvaluator;
    }

    /**
     * The following mess is an implementation of the Shunting-Yard Algorithm: http://wcipeg.com/wiki/Shunting_yard_algorithm
     * See also: https://en.wikipedia.org/wiki/Shunting-yard_algorithm
     */
    this.tokenizer.tokenize(`(${sql})`, (token, surroundedBy) => {
      tokenCount++;

      /**
       * Read a token.
       */

      if (typeof token === 'string' && !surroundedBy) {
        let normalizedToken = token.toUpperCase();

        /**
         * If the token is an operator, o1, then:
         */
        if (this.operators[normalizedToken]) {
          /**
           * Hard-coded rule for between to ignore the next AND.
           */
          if (lastOperator === 'BETWEEN' && normalizedToken === 'AND') {
            lastOperator = 'AND';
            return;
          }

          /**
           * If the conditions are right for unary minus, convert it.
           */
          if (
            normalizedToken === '-' &&
            (tokenCount === 1 || lastTokenWasOperatorOrLeftParenthesis)
          ) {
            normalizedToken = OPERATOR_UNARY_MINUS;
          }

          /**
           * While there is an operator token o2 at the top of the operator stack,
           * and o1's precedence is less than or equal to that of o2,
           * pop o2 off the operator stack, onto the output queue:
           */
          while (
            operatorStack[operatorStack.length - 1] &&
            operatorStack[operatorStack.length - 1] !== '(' &&
            this.operatorPrecedenceFromValues(
              normalizedToken,
              operatorStack[operatorStack.length - 1],
            )
          ) {
            const operator = this.operators[operatorStack.pop()];
            const operands = [];
            let numOperands = operator.type;
            while (numOperands--) {
              operands.unshift(outputStream.pop());
            }
            outputStream.push(evaluator(operator.value, operands));
          }

          /**
           * At the end of iteration push o1 onto the operator stack.
           */
          operatorStack.push(normalizedToken);
          lastOperator = normalizedToken;

          lastTokenWasOperatorOrLeftParenthesis = true;

          /**
           * If the token is a left parenthesis (i.e. "("), then push it onto the stack:
           */
        } else if (token === '(') {
          operatorStack.push(token);
          lastTokenWasOperatorOrLeftParenthesis = true;

          /**
           * If the token is a right parenthesis (i.e. ")"):
           */
        } else if (token === ')') {
          /**
           * Until the token at the top of the stack is a left parenthesis,
           * pop operators off the stack onto the output queue.
           */
          while (
            operatorStack.length &&
            operatorStack[operatorStack.length - 1] !== '('
          ) {
            const operator = this.operators[operatorStack.pop()];
            const operands = [];
            let numOperands = operator.type;
            while (numOperands--) {
              operands.unshift(outputStream.pop());
            }

            outputStream.push(evaluator(operator.value, operands));
          }
          if (!operatorStack.length) {
            throw new SyntaxError('Unmatched parenthesis.');
          }
          /**
           * Pop the left parenthesis from the stack, but not onto the output queue.
           */
          operatorStack.pop();
          lastTokenWasOperatorOrLeftParenthesis = false;

          /**
           * Push everything else to the output queue.
           */
        } else {
          outputStream.push(token);
          lastTokenWasOperatorOrLeftParenthesis = false;
        }

        /**
         * Push explicit strings to the output queue.
         */
      } else {
        outputStream.push(token);
        lastTokenWasOperatorOrLeftParenthesis = false;
      }
    });

    /**
     * While there are still operator tokens in the stack:
     */
    while (operatorStack.length) {
      const operatorValue = operatorStack.pop();

      /**
       * If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
       */
      if (operatorValue === '(') {
        throw new SyntaxError('Unmatched parenthesis.');
      }
      const operator = this.operators[operatorValue];
      const operands = [];
      let numOperands = operator.type;
      while (numOperands--) {
        operands.unshift(outputStream.pop());
      }

      /**
       * Pop the operator onto the output queue.
       */
      outputStream.push(evaluator(operator.value, operands));
    }

    if (outputStream.length > 1) {
      throw new SyntaxError('Could not reduce to a single expression.');
    }

    return outputStream[0];
  }

  /**
   *
   * @param {string} sql
   * @returns {[]}
   */
  toArray(sql) {
    let expression = [];
    let tokenCount = 0;
    let lastToken = undefined;
    const expressionParentheses = [];

    this.tokenizer.tokenize(`(${sql})`, (token, surroundedBy) => {
      tokenCount++;

      switch (token) {
        case '(':
          expressionParentheses.push(expression.length);
          break;
        case ')':
          const precedenceParenthesisIndex = expressionParentheses.pop();

          let expressionTokens = expression.splice(
            precedenceParenthesisIndex,
            expression.length,
          );

          while (
            expressionTokens &&
            expressionTokens.constructor === Array &&
            expressionTokens.length === 1
          ) {
            expressionTokens = expressionTokens[0];
          }
          expression.push(expressionTokens);
          break;
        case '':
          break;
        case ',':
          break;
        default:
          let operator = null;
          if (!surroundedBy) {
            operator = this.getOperator(token);
            if (
              token === '-' &&
              (tokenCount === 1 ||
                lastToken === '(' ||
                (lastToken && lastToken.constructor === Operator))
            ) {
              operator = this.getOperator(OPERATOR_UNARY_MINUS);
            }
          }
          expression.push(operator ? operator : token);
          break;
      }
      lastToken = token;
    });

    while (
      expression &&
      expression.constructor === Array &&
      expression.length === 1
    ) {
      expression = expression[0];
    }

    return expression;
  }

  /**
   *
   * @param {string|Symbol} operatorValue1
   * @param {string|Symbol} operatorValue2
   * @returns {boolean}
   */
  operatorPrecedenceFromValues(operatorValue1, operatorValue2) {
    return (
      this.operators[operatorValue2].precedence <=
      this.operators[operatorValue1].precedence
    );
  }

  /**
   *
   * @param {string|Symbol} operatorValue
   * @returns {*}
   */
  getOperator(operatorValue) {
    if (typeof operatorValue === 'string') {
      return this.operators[operatorValue.toUpperCase()];
    }
    if (typeof operatorValue === 'symbol') {
      return this.operators[operatorValue];
    }
    return null;
  }

  /**
   *
   * @param {string|Symbol} operatorValue
   * @param {[]} operands
   * @returns {*}
   */
  defaultEvaluator(operatorValue, operands) {
    /**
     * Convert back to regular minus, now that we have the proper number of operands.
     */
    if (operatorValue === OPERATOR_UNARY_MINUS) {
      operatorValue = '-';
    }
    /**
     * This is a trick to avoid the problem of inconsistent comma usage in SQL.
     */
    if (operatorValue === ',') {
      return [].concat(operands[0], operands[1]);
    }

    return {
      [operatorValue]: operands,
    };
  }

  /**
   *
   * @returns {{operators: [{}], tokenizer: {shouldTokenize: string[], shouldMatch: string[], shouldDelimitBy: string[]}}}
   */
  static get defaultConfig() {
    return {
      operators: [
        // TODO: add more operator definitions
        {
          '!': OPERATOR_TYPE_UNARY,
        },
        unaryMinusDefinition,
        {
          '^': OPERATOR_TYPE_BINARY,
        },
        {
          '*': OPERATOR_TYPE_BINARY,
          '/': OPERATOR_TYPE_BINARY,
          '%': OPERATOR_TYPE_BINARY,
        },
        {
          '+': OPERATOR_TYPE_BINARY,
          '-': OPERATOR_TYPE_BINARY,
        },
        {
          '=': OPERATOR_TYPE_BINARY,
          '<': OPERATOR_TYPE_BINARY,
          '>': OPERATOR_TYPE_BINARY,
          '<=': OPERATOR_TYPE_BINARY,
          '>=': OPERATOR_TYPE_BINARY,
          '!=': OPERATOR_TYPE_BINARY,
        },
        {
          ',': OPERATOR_TYPE_BINARY, // We treat commas as an operator, to aid in turning arbitrary numbers of comma-separated values into arrays.
        },
        {
          NOT: OPERATOR_TYPE_UNARY,
        },
        {
          BETWEEN: OPERATOR_TYPE_TERNARY,
          IN: OPERATOR_TYPE_BINARY,
          IS: OPERATOR_TYPE_BINARY,
          LIKE: OPERATOR_TYPE_BINARY,
        },
        {
          AND: OPERATOR_TYPE_BINARY,
        },
        {
          OR: OPERATOR_TYPE_BINARY,
        },
      ],
      tokenizer: {
        shouldTokenize: [
          '(',
          ')',
          ',',
          '*',
          '/',
          '%',
          '+',
          '-',
          '=',
          '!=',
          '!',
          '<',
          '>',
          '<=',
          '>=',
          '^',
        ],
        shouldMatch: ['"', "'", '`'],
        shouldDelimitBy: [' ', '\n', '\r', '\t'],
      },
    };
  }

  static get Operator() {
    return Operator;
  }

  static get OPERATOR_UNARY_MINUS() {
    return OPERATOR_UNARY_MINUS;
  }
}

/**
 *
 * @type {SqlWhereParser}
 */
export default SqlWhereParser;
