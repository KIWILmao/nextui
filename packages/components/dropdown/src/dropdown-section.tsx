import {forwardRef} from "@nextui-org/system";
import {dropdownSection} from "@nextui-org/theme";
import {Node} from "@react-types/shared";
import {TreeState} from "@react-stately/tree";
import {useMenuSection} from "@react-aria/menu";
import {useMemo, Key, useId} from "react";
import {mergeProps} from "@react-aria/utils";
import {clsx} from "@nextui-org/shared-utils";
import {Divider} from "@nextui-org/divider";

import DropdownItem, {DropdownItemProps} from "./dropdown-item";
import {DropdownSectionBaseProps} from "./base/dropdown-section-base";

export interface DropdownSectionProps<T extends object = object> extends DropdownSectionBaseProps {
  item: Node<T>;
  state: TreeState<T>;
  /**
   * The dropdown items variant.
   */
  variant?: DropdownItemProps["variant"];
  /**
   * The dropdown items color.
   */
  color?: DropdownItemProps["color"];
  /**
   * Whether to disable the items animation.
   * @default false
   */
  disableAnimation?: boolean;
  /**
   * Whether the menu should close when the menu item is selected.
   * @default true
   */
  closeOnSelect?: DropdownItemProps["closeOnSelect"];
  /**
   * Callback fired when the menu item is selected.
   */
  onAction?: (key: Key) => void;
}

/**
 * @internal
 */
const DropdownSection = forwardRef<DropdownSectionProps, "li">(
  (
    {
      item,
      state,
      as,
      variant,
      color,
      key: keyProp,
      disableAnimation,
      onAction,
      closeOnSelect,
      className,
      classNames,
      showDivider = false,
      dividerProps = {},
      itemClasses,
      // removed title from props to avoid browsers showing a tooltip on hover
      // the title props is already inside the rendered prop
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      title,
      ...otherProps
    },
    _,
  ) => {
    const headingId = useId();

    const Component = as || "li";

    const slots = useMemo(() => dropdownSection(), []);

    const baseStyles = clsx(classNames?.base, className);
    const dividerStyles = clsx(classNames?.divider, dividerProps.className);

    const {itemProps, headingProps, groupProps} = useMenuSection({
      heading: item.rendered,
      "aria-label": item["aria-label"],
    });

    return (
      <Component
        key={keyProp || item.key}
        data-slot="base"
        {...mergeProps(itemProps, otherProps)}
        className={slots.base({class: baseStyles})}
      >
        {item.rendered && (
          <span
            {...headingProps}
            className={slots.heading({class: classNames?.heading})}
            data-slot="heading"
            id={headingId}
          >
            {item.rendered}
          </span>
        )}
        <ul
          {...groupProps}
          aria-labelledby={headingId}
          className={slots.group({class: classNames?.group})}
          data-has-title={!!item.rendered}
          data-slot="group"
        >
          {[...item.childNodes].map((node) => {
            let dropdownItem = (
              <DropdownItem
                key={node.key}
                classNames={itemClasses}
                closeOnSelect={closeOnSelect}
                color={color}
                disableAnimation={disableAnimation}
                item={node}
                state={state}
                variant={variant}
                onAction={onAction}
                {...node.props}
              />
            );

            if (node.wrapper) {
              dropdownItem = node.wrapper(dropdownItem);
            }

            return dropdownItem;
          })}
          {showDivider && (
            <Divider
              as="li"
              className={slots.divider({
                class: dividerStyles,
              })}
              {...dividerProps}
            />
          )}
        </ul>
      </Component>
    );
  },
);

DropdownSection.displayName = "NextUI.DropdownSection";

export default DropdownSection;
