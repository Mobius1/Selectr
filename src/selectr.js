class SelectrOption extends Option {
    constructor(props) {
        super(props);
    }

    enable() {
        this.disabled = false;
    }

    disable() {
        this.disabled = true;
    }

    select() {
        this.selected = true;
    }

    deselect() {
        this.selected = false;
    }
}

class Selectr {
    constructor(el, props) {

        this.defaultConfig = {
            pagination: false,
            strings: {
                placeholder: "Select an option...",
            },
        };

        this.el = el;

        if (typeof el === "string") {
            this.el = document.querySelector(el);
        }

        this.init(props);
    }

    init(options) {

        this.el.selectr = this;

        if (options) {
            this.config = Object.assign({}, this.defaultConfig, options);
        }

        this.closed = true;
        this.navIndex = 0;
        this.pageIndex = 0;
        this.multiple = this.el.multiple || this.config.multiple || false;

        if (this.config.ajax) {
            this.loaded = false;
            fetch(this.config.ajax.url).then(r => r.json()).then((data) => {
                for (const item of data) {
                    this.el.add(new SelectrOption(item.text, item.value, item.selected, item.selected));
                }
                this.refresh();
                this.loaded = true;
            });
        }

        if (this.config.data) {
            const data = this.config.data;

            for (const item of data) {
                if (item.options) {
                    const optgroup = document.createElement("optgroup");
                    optgroup.label = item.text;

                    for (const option of item.options) {
                        optgroup.appendChild(new SelectrOption(option.text, option.value, option.selected, option.selected));
                    }

                    this.el.add(optgroup);
                } else {
                    this.el.add(new SelectrOption(item.text, item.value, item.selected, item.selected));
                }
            }
        }

        this.render();
        this.bind();
    }

    refresh() {
        this.options = [...this.el.options];

        if (this.options.length) {
            this.createList();
            this.renderList();

            if (this.multiple) {
                this.renderTags();
            } else {
                const option = this.el.options[this.el.selectedIndex];
                this.nodes.value.dataset.value = option.value;
                this.nodes.value.textContent = option.textContent;
            }
        }

        this.update();
    }

    render(type) {

        if (type === undefined) {
            this.el.classList.add("selectr-element");

            const container = document.createElement("div");
            const display = document.createElement("div");
            const value = document.createElement("div");
            const optsContainer = document.createElement("div");
            const items = document.createElement("ul");

            container.classList.add("selectr-container");
            container.classList.toggle("selectr-multiple", this.multiple);

            display.classList.add("selectr-display");

            value.classList.add("selectr-value");

            display.appendChild(value);
            container.appendChild(display);

            optsContainer.classList.add("selectr-options-container");

            items.classList.add("selectr-options");

            optsContainer.appendChild(items);

            container.appendChild(optsContainer);

            this.nodes = {
                container,
                display,
                value,
                items
            };

            this.refresh();

            if (this.config.ajax && !this.loaded) {
                this.nodes.container.classList.add("loading");
                this.message("Loading data...");
            }

            this.el.parentNode.insertBefore(container, this.el);
            container.appendChild(this.el);
        } else {
            switch (type) {
                case "list":
                    this.renderList();
                    break;
                case "tags":
                    this.renderTags();
                    break;
                case "tag":
                    this.renderTag();
                    break;
            }
        }
    }

    createList() {
        const optgroups = this.el.querySelectorAll("optgroup");
        const createItem = (option) => {
            const item = document.createElement("li");
            item.classList.add("selectr-option");
            item.classList.toggle("selectr-selected", option.index === this.el.selectedIndex);
            item.classList.toggle("disabled", option.disabled);

            item.textContent = option.textContent;
            item.dataset.value = option.value;
            item.disabled = option.disabled;
            item.index = option.index;

            return item;
        };

        if (optgroups.length) {
            this.items = [];
            this.groups = [];
            this.nodes.items.classList.add("optgroups");
            for (const group of optgroups) {
                const opt = document.createElement("ul");
                const label = document.createElement("li");

                label.classList.add("selectr-optgroup--label");
                label.textContent = group.label;

                opt.classList.add("selectr-optgroup");
                opt.appendChild(label);

                this.groups.push(opt);
                for (const option of group.children) {
                    const item = createItem(option);
                    opt.appendChild(item);
                    this.items.push(item);
                }
            }
        } else {
            this.items = this.options.map(option => createItem(option));
        }
    }

    renderList() {
        const frag = document.createDocumentFragment();
        const optgroups = this.el.querySelectorAll("optgroup");

        if (optgroups.length) {
            for (const group of this.groups) {
                frag.appendChild(group);
            }
        } else {
            const collection = this.config.pagination ? this.options.slice(0, (this.pageIndex + 1) * this.config.pagination) : this.options;
            for (const option of collection) {
                frag.appendChild(this.items[option.index]);
            }
        }

        this.nodes.items.innerHTML = ``;
        this.nodes.items.appendChild(frag);
    }

    renderTags() {
        const frag = document.createDocumentFragment();
        for (const option of this.el.selectedOptions) {
            frag.appendChild(this.renderTag(option.textContent, option.value, option.index));
        }
        this.nodes.value.innerHTML = ``;
        this.nodes.value.appendChild(frag);
    }

    renderTag(text, value, index) {
        const tag = document.createElement("div");
        tag.classList.add("selectr-tag");
        tag.dataset.value = value;
        tag.index = index;

        const span = document.createElement("span");
        span.textContent = text;

        const button = document.createElement("button");
        button.classList.add("selectr-tag-remove");
        button.type = "button";

        tag.appendChild(span);
        tag.appendChild(button);

        return tag;
    }

    bind() {
        this.events = {
            click: this.click.bind(this),
            toggle: this.toggle.bind(this),
            blur: this.blur.bind(this),
            navigate: this.navigate.bind(this),
            scroll: this.onScroll.bind(this),
        };

        document.addEventListener("mousedown", this.events.blur);
        window.addEventListener("keydown", this.events.navigate);
        this.nodes.display.addEventListener("click", this.events.toggle);
        this.nodes.items.addEventListener("scroll", this.events.scroll);
        this.nodes.items.addEventListener("click", this.events.click);
    }

    unbind() {
        document.removeEventListener("mousedown", this.events.blur);
        window.removeEventListener("keydown", this.events.navigate);
        this.nodes.display.removeEventListener("click", this.events.toggle);
        this.nodes.items.removeEventListener("click", this.events.click);
    }

    onScroll(e) {
        if (!this.closed) {
            const st = this.nodes.items.scrollTop;
            const sh = this.nodes.items.scrollHeight;
            const ch = this.nodes.items.clientHeight;

            if (st >= sh - ch) {
                this.pageIndex++;
                this.renderList();
            }
        }
    }

    navigate(e) {
        if (this.closed) return;

        if (e.which === 13) {

            // if ( this.noResults || (this.config.taggable && this.input.value.length > 0) ) {
            // 		return false;
            // }

            return this.select(this.navIndex);
        }

        let direction;
        const prevEl = this.items[this.navIndex];
        const lastIndex = this.navIndex;

        switch (e.which) {
            case 38:
                direction = 0;
                if (this.navIndex > 0) {
                    this.navIndex--;
                }
                break;
            case 40:
                direction = 1;
                if (this.navIndex < this.items.length - 1) {
                    this.navIndex++;
                }
        }

        this.navigating = true;

        // loop items and skip disabled / excluded items
        while (this.items[this.navIndex].classList.contains("disabled") || this.items[this.navIndex].classList.contains("excluded")) {
            if (this.navIndex > 0 && this.navIndex < this.items.length - 1) {
                if (direction) {
                    this.navIndex++;
                } else {
                    this.navIndex--;
                }
            } else {
                this.navIndex = lastIndex;
                break;
            }

            // if (this.searching) {
            // 		if (this.navIndex > this.nodes.items.lastElementChild.index) {
            // 				this.navIndex = this.nodes.items.lastElementChild.index;
            // 				break;
            // 		} else if (this.navIndex < this.nodes.items.firstElementChild.index) {
            // 				this.navIndex = this.nodes.items.firstElementChild.index;
            // 				break;
            // 		}
            // }
        }

        // Autoscroll the dropdown during navigation
        const r = this.items[this.navIndex].getBoundingClientRect();

        if (!direction) {
            if (this.navIndex === 0) {
                this.nodes.items.scrollTop = 0;
            } else if (r.top - this.rect.top < 0) {
                this.nodes.items.scrollTop = this.nodes.items.scrollTop + (r.top - this.rect.top);
            }
        } else {
            if (this.navIndex === 0) {
                this.nodes.items.scrollTop = 0;
            } else if ((r.top + r.height) > (this.rect.top + this.rect.height)) {
                this.nodes.items.scrollTop = this.nodes.items.scrollTop + ((r.top + r.height) - (this.rect.top + this.rect.height));
            }

            // Load another page if needed
            if (this.navIndex === this.nodes.items.childElementCount - 1 && this.requiresPagination) {
                // load.call(this);
            }
        }

        if (prevEl) {
            prevEl.classList.remove("active");
        }

        this.items[this.navIndex].classList.add("active");
    }

    destroy() {
        this.unbind();
        this.el.classList.remove("selectr-element");
        this.nodes.container.parentNode.replaceChild(this.el, this.nodes.container);
    }

    select(option) {
        let index;

        if (!isNaN(option)) {
            // index
            index = option;
        } else if (option instanceof Element) {
            // option or item
            index = option.index;
        }

        const active = this.options[index];
        const el = this.items[index];
        this.navIndex = index;

        active.selected = !this.multiple ? true : (active.selected ? false : true);

        if (this.multiple) {
            if (this.el.selectedOptions.length) {
                this.renderTags();
            }
        } else {
            this.nodes.value.textContent = el.textContent;
            this.nodes.value.dataset.value = el.dataset.value;
        }

        if (!this.multiple) {
            this.close();
        }

        this.update();
    }

    click(e) {
        const target = e.target;
        const el = target.closest(".selectr-option");

        if (el) {

            if (el.disabled) {
                return;
            }

            this.select(el);
        }
    }

    open() {
        if (this.closed) {
            this.closed = false;
            this.nodes.container.classList.add("selectr-open");

            this.rect = this.nodes.items.getBoundingClientRect();

            const st = this.nodes.items.scrollTop;
            const sh = this.nodes.items.scrollHeight;
            const ch = this.nodes.items.clientHeight;

            this.scrollData = {
                pos: st,
                max: sh - ch,
            };
        }
    }

    close() {
        if (!this.closed) {
            this.closed = true;
            this.nodes.container.classList.remove("selectr-open");
        }
    }

    blur(e) {
        if (!this.nodes.container.contains(e.target)) {
            this.close();
        }
    }

    toggle(e) {

        e.preventDefault();

        if (e.target.closest(".selectr-tag-remove")) {
            const tag = e.target.closest(".selectr-tag");

            this.nodes.value.removeChild(tag);
            this.options[tag.index].selected = false;
            return this.update();
        }

        if (this.closed) {
            this.open();
        } else {
            this.close();
        }
    }

    message(text) {
        this.nodes.value.innerHTML = ``;
        this.nodes.value.textContent = text;
    }

    update() {
        this.nodes.container.classList.toggle("has-selected", this.el.selectedOptions.length);
        this.nodes.container.classList.remove("loading");

        for (const option of this.options) {
            const item = this.items[option.index];
            item.classList.toggle("selectr-selected", option.selected);
            item.classList.toggle("disabled", option.disabled);
            item.disabled = option.disabled;
        }

        if (!this.el.selectedOptions.length) {
            this.message(this.config.strings.placeholder);
        }
    }
}