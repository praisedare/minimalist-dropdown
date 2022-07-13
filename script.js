(function initializeDropdowns() {
    const selector_dropdown = 'cx-dropdown',
          selector_dropdownContent = 'cx-dropdown__content',
          selector_dropdownToggle = 'cx-dropdown__toggle',
          selector_dropdownItemsContainer = 'cx-dropdown__items-container',
          selector_dropdownHeader = 'cx-dropdown__header';

    const minDropdownHeight = 90,
          dropdownMargin = 5;

    const proto = Object.create(HTMLElement.prototype, Object.getOwnPropertyDescriptors({
        get $toggle() { return this.querySelector('.'+selector_dropdownToggle); },
        get $content() { return this.querySelector('.'+selector_dropdownContent); },
        get $header() { return this.querySelector('.'+selector_dropdownHeader); },
        get $itemsContainer() { return this.querySelector('.'+selector_dropdownItemsContainer); },
        get isOpen() { return getComputedStyle(this.$content).display != 'none'; },
        hideContent() {
            this.$content.style.display = 'none';
        },
        showContent() {
            this.$content.style.display = 'block';
        },
    }));
    document.querySelectorAll('.'+selector_dropdown).forEach(dropdown => {
        Object.setPrototypeOf(dropdown, proto);
        dropdown.$toggle.addEventListener('click', dropdownToggler);
        autoCloseDropdown(dropdown);
    });

    function dropdownToggler(e) {
        let dropdown = e.target.closest('.'+selector_dropdown);
        if (! dropdown.isOpen) {
            positionDropdownContent(dropdown);
            dropdown.showContent();
        } else {
            dropdown.hideContent();
        }
    }

    function autoCloseDropdown(dropdown) {
        document.addEventListener('click', e => {
            let target = e.target.closest('.'+selector_dropdown);
            if (target !== dropdown)
                dropdown.hideContent();
        });
    }

    function positionDropdownContent(dropdown) {
        // display the menu in a 'hidden' position so its dimensions can be read
        Object.assign(dropdown.$content.style, {
            position: 'fixed',
            display: 'block',
            bottom: '999999px',
            right: '999999px',
        });

        let contentDimensions = dropdown.$content.getBoundingClientRect(),
            dropdownToggleDimensions = dropdown.$toggle.getBoundingClientRect(),
            dropdownToggleHeight = dropdownToggleDimensions.height,
            availableHeightAbove = dropdownToggleDimensions.top,
            availableHeightBelow = window.innerHeight - dropdownToggleDimensions.bottom;
        
        Object.assign(dropdown.$content.style, { // clear previous positioning
            position: 'absolute',
            top: '',
            bottom: '',
            right: '',
            bottom: '',
        });

        // position it above/below toggle depending on available space
        if (availableHeightBelow > availableHeightAbove || availableHeightBelow >= minDropdownHeight) {
            Object.assign(dropdown.$content.style, {
                top: '100%',
                'max-height': availableHeightBelow - dropdownMargin + 'px',
            });
        } else {
            Object.assign(dropdown.$content.style, {
                bottom: '100%',
                'max-height': availableHeightAbove - dropdownMargin + 'px',
            });
        }

        // ---- position horizontally ------
        // dropdowns will be aligned with the left of their host by default

        // space needed to right align the element
        let spaceFromElementLeftToScreenRight = window.innerWidth - dropdownToggleDimensions.left,
            // space needed to perform a left align
            spaceFromScreenLeftToElementRight = window.innerWidth - dropdownToggleDimensions.right;
        if (spaceFromElementLeftToScreenRight >= contentDimensions.width)
            dropdown.$content.style.left = 0;
        else if (spaceFromScreenLeftToElementRight >= contentDimensions.width)
            dropdown.$content.style.right = 0;
        else // make it full width
            Object.assign(dropdown.$content.style, {
                left: 0,
                right: 0,
            });

        // Set height of drodpown items container
        dropdown.$itemsContainer.style.maxHeight = '';
        dropdown.$itemsContainer.style.maxHeight = dropdown.$content.getBoundingClientRect().height - dropdown.$header.getBoundingClientRect().height + 'px';
    }
})();

