import type { LogicOperator } from "./logic-operator";

export interface Predicate {
    predicate_name: string;
	predicate_logic: LogicOperator;
	measurement_source: string;
	predicate_comparison_value: string;
}