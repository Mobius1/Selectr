export interface IData {
	text: string;
	value: string;
	selected?: boolean;
	disabled?: boolean;
	children?: IData[];
}
export interface IOptions {
	defaultSelected?: boolean;
	multiple?: boolean;
	searchable?: boolean;
	allowDeselect?: string;
	clearable?: boolean;
	width?: number | string;
	placeholder?: string;
	maxSelections?: number;
	taggable?: boolean;
	tagSeperators?: string[];
	tagPlaceholder?: string;
	data?: IData[];
	renderOption?: () => string;
	renderSelection?: () => string;
	pagination?: number;
	nativeDropdown?: boolean;
	closeOnScroll?: boolean;
	sortSelected?: 'text' | 'value';
	customClass?: string;
	messages?: {
		noResults: string;
		maxSelections: string;
		tagDuplicate: string;
	};
}

export default class Selectr {
	constructor(select: HTMLSelectElement, options: IOptions);
	setValue: (value: string | string[]) => void;
	getValue: (toObject: boolean, toJson: boolean) => string | { text: string, value: string };
	search: (query: string, anchor: boolean) => IData[];
	add: (data: IData | IData[]) => void;
	remove: (data: number | string | number[] | string[]) => void;
	removeAll: () => void;
	serialize: (toJson: boolean) => string | IData[];
	open: () => void;
	close: () => void;
	toggle: () => void;
	clear: () => void;
	reset: () => void;
	disable: () => void;
	enable: () => void;
	on(event: 'selectr.init', fun: () => void);
	on(event: 'selectr.select', fun: (option: HTMLOptionElement) => void);
	on(event: 'selectr.deselect', fun: (option: HTMLOptionElement) => void);
	on(event: 'selectr.change', fun: (option: HTMLOptionElement) => void);
	on(event: 'selectr.open', fun: () => void);
	on(event: 'selectr.close', fun: () => void);
	on(event: 'selectr.clear', fun: () => void);
	on(event: 'selectr.reset', fun: () => void);
	on(event: 'selectr.paginate', fun: (data: {
		items: number;
		total: number;
		page: number;
		pages: number;
	}) => void);
}

