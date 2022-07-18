(() =>  {

/**
 * Creates a component that allows you to filter through a list of items. *Think
 * dropdown search filters, but without the dropdown*
 *
 * **How to create instances**
 * 
 * You create instances of this component the same way you instantiate
 * objects from classes.
 * The constructor receives two arguments:
 * - `itemRenderer`: A function that is used to render items
 * - `listItems`: An array of the data to be turned into a list
 * The itemRenderer argument is simply used to set the `renderItem`
 * property on the component. That is the method that will be called
 * whenever a data item needs to be rendered as a list item, and as
 * such, the method is expected to return an `HTMLElement`.
 * @example
 * ```js
 * const renderFunction = function(data) {
 *     let $p = document.createElement('p');
 *     $p.innerHTML = data.text;
 *     return $p;
 * });
 *
 * const data = [
 *     {text: 'hey'},
 *     {text: 'yolo!'},
 * ];
 *
 * const $searchList = new SearchableList(renderFunction, data);
 * ```
 *
 *
 * **API**
 * 
 * The component exposes some public API that you can use to manage the list.
 *  - `$searchBar`[property]: Returns the search element
 *
 *  - `$listItemsContainer`[property]: Returns the container element for the list items
 *
 *  - `$noMatchMsg`[property]: Returns the element that will be displayed when no match
 *    is found for a search.  
 *
 *  - `setListItems(listItems: array)`[method]; Wipes the current list items and renders
 *    the data supplied as a replacement for the previous list items.
 *
 *  - `addListItem(listItem)`[method]: Adds a new item to the list.
 *
 *  - `renderItem`: A property whose value should be set to the render function. Trying
 *    to render list items without setting this function (either manually or during
 *    instantiation through the constructor) will cause an error to be thrown.
 *
 */
const SearchableList = (() => {
    // Selectors
    const selector_prefix = 'js_component__searchable-list',
          selector_searchBar = selector_prefix + '__searchbar',
          selector_listItemsContainer = selector_prefix + '__list-items-container',
          selector_noMatchMsg = selector_prefix + '__no-match-msg';

    const proto = Object.create(HTMLDivElement.prototype, Object.getOwnPropertyDescriptors({
        get $searchBar() { return this.querySelector('.' + selector_searchBar); },
        get $listItemsContainer() { return this.querySelector('.' + selector_listItemsContainer) },
        get $noMatchMsg() { return this.querySelector('.' + selector_noMatchMsg); },

        set title(t) {
            this.$searchBar.placeholder = t;
        },

        renderItem: null,

        addListItem(listItem) {
            if (! this.renderItem)
                throw 'Item Render function "renderItem" not set';

            let li = document.createElement('li');
            li.className = constructor.classNames.listItem;
            li.append(this.renderItem(listItem));

            this.$listItemsContainer.append(li);
        },

        setListItems(listItems) {
            if (! this.renderItem)
                throw 'Item Render function "renderItem" not set';

            this.$listItemsContainer.innerHTML = '';

            for (let listItem of listItems)
                this.addListItem(listItem);
        },

        filterText(txt) {
            txt = txt.toLowerCase().trim();
            let visibleCount = 0;

            Array.from(this.$listItemsContainer.children).forEach(c => {
                if (c.innerText.toLowerCase().trim().includes(txt))
                    c.style.display = '', visibleCount += 1;
                else
                    c.style.display = 'none';
            });

            if (! visibleCount) {
                this.$listItemsContainer.style.display = 'none';
                this.$noMatchMsg.style.display = '';
            } else {
                this.$listItemsContainer.style.display = '';
                this.$noMatchMsg.style.display = 'none';
            }
        },
    }));

    const createComponent = () => {
        let $component = getComponentTemplate().cloneNode(true); 
        Object.setPrototypeOf($component, proto);

        let searchHandler = $component.filterText.bind($component);
        $component.$searchBar.addEventListener('keyup', e => searchHandler(e.target.value));

        return $component;
    };

    const getComponentTemplate = () => {
        let $component = document.createElement('div');
        $component.className = selector_prefix;

        let classNames = constructor.classNames;
        $component.innerHTML = `
            <input type="search" class="${ selector_searchBar } ${ classNames?.searchBar ?? '' }">
            <ul class="${ selector_listItemsContainer } ${ classNames?.listItemsContainer ?? '' }"></ul>
            <div class="${ selector_noMatchMsg } ${ classNames?.noMatchMsg ?? '' }" style="display: none;">No match found</div>
        `; 
        return $component;
    };

    /**
     * The constructor function.
     * @param {Function|null} itemRenderer
     * @param {Array<{}>|null} listItems
     */
    function constructor(itemRenderer, listItems) {
        const $component = createComponent();

        $component.renderItem = itemRenderer;
        if (listItems)
            $component.setListItems(listItems);

        return $component;
    };
    /**
     * You can provide classnames to be used for the different parts of
     * the component inorder to apply styles to them.
     */
    constructor.classNames = () => ({
        searchBar: '',
        listItemsContainer: '',
        listItem: '',
        noMatchMsg: '',
    });

    return constructor;
})();

// Insert stylesheet
// const link = document.createElement('link');
// link.rel = 'stylesheet';
// link.href = '';
// document.body.append();



globalThis.SearchableList = SearchableList;
})();

