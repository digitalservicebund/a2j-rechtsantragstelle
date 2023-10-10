import type { Schema, Attribute } from "@strapi/strapi";

export interface BasicHeading extends Schema.Component {
  collectionName: "components_basic_headings";
  info: {
    displayName: "Heading";
    description: "";
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    tagName: Attribute.Enumeration<
      ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"h1">;
    look: Attribute.Enumeration<
      [
        "default",
        "ds-heading-01-reg",
        "ds-heading-02-reg",
        "ds-heading-03-reg",
        "ds-heading-03-bold",
        "ds-subhead",
        "ds-label-01-reg",
        "ds-label-01-bold",
        "ds-label-02-reg",
        "ds-label-02-bold",
        "ds-label-03-reg",
        "ds-label-03-bold",
        "ds-label-section",
        "ds-body-01-reg",
        "ds-body-02-reg",
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
  };
}

export interface BasicLink extends Schema.Component {
  collectionName: "components_basic_links";
  info: {
    displayName: "Link";
    description: "";
  };
  attributes: {
    text: Attribute.String;
    url: Attribute.String & Attribute.Required;
    openInNewTab: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface BasicParagraph extends Schema.Component {
  collectionName: "components_basic_paragraphs";
  info: {
    displayName: "Paragraph";
    description: "";
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
  };
}

export interface FormElementsButton extends Schema.Component {
  collectionName: "components_form_elements_buttons";
  info: {
    displayName: "Button";
    description: "";
  };
  attributes: {
    look: Attribute.Enumeration<["primary", "secondary", "tertiary", "ghost"]> &
      Attribute.Required &
      Attribute.DefaultTo<"primary">;
    size: Attribute.Enumeration<["large", "medium", "small"]> &
      Attribute.Required;
    fullWidth: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    href: Attribute.String;
    text: Attribute.String;
  };
}

export interface FormElementsDropdown extends Schema.Component {
  collectionName: "components_form_elements_dropdowns";
  info: {
    displayName: "Dropdown";
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    label: Attribute.Text;
    options: Attribute.Component<"form-helper.select-option", true>;
    altLabel: Attribute.Text;
    placeholder: Attribute.Text;
    errors: Attribute.Relation<
      "form-elements.dropdown",
      "oneToMany",
      "api::error.error"
    >;
  };
}

export interface FormElementsInput extends Schema.Component {
  collectionName: "components_basic_inputs";
  info: {
    displayName: "Input";
    description: "";
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    label: Attribute.String;
    type: Attribute.Enumeration<["text", "number"]> &
      Attribute.Required &
      Attribute.DefaultTo<"text">;
    errors: Attribute.Relation<
      "form-elements.input",
      "oneToMany",
      "api::error.error"
    >;
    placeholder: Attribute.String;
    suffix: Attribute.String;
    width: Attribute.Enumeration<
      [
        "characters3",
        "characters5",
        "characters7",
        "characters10",
        "characters16",
        "characters24",
        "characters36",
        "characters54",
      ]
    >;
  };
}

export interface FormElementsSelect extends Schema.Component {
  collectionName: "components_basic_selects";
  info: {
    displayName: "Select";
    description: "";
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    label: Attribute.String;
    options: Attribute.Component<"form-helper.select-option", true>;
    altLabel: Attribute.String;
    errors: Attribute.Relation<
      "form-elements.select",
      "oneToMany",
      "api::error.error"
    > &
      Attribute.Required;
  };
}

export interface FormHelperErrors extends Schema.Component {
  collectionName: "components_basic_errors";
  info: {
    displayName: "Errors";
    description: "";
  };
  attributes: {
    code: Attribute.String;
    text: Attribute.String;
  };
}

export interface FormHelperSelectOption extends Schema.Component {
  collectionName: "components_basic_select_options";
  info: {
    displayName: "SelectOption";
    description: "";
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    value: Attribute.String & Attribute.Required;
  };
}

export interface MetaBackground extends Schema.Component {
  collectionName: "components_meta_backgrounds";
  info: {
    displayName: "Outer Background";
    description: "";
  };
  attributes: {
    backgroundColor: Attribute.Enumeration<
      ["default", "white", "blue", "darkBlue", "yellow"]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
    paddingTop: Attribute.Enumeration<
      [
        "default",
        "px0",
        "px8",
        "px16",
        "px24",
        "px32",
        "px40",
        "px48",
        "px56",
        "px64",
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
    paddingBottom: Attribute.Enumeration<
      [
        "default",
        "px0",
        "px8",
        "px16",
        "px24",
        "px32",
        "px40",
        "px48",
        "px56",
        "px64",
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
  };
}

export interface MetaContainer extends Schema.Component {
  collectionName: "components_meta_containers";
  info: {
    displayName: "Container";
    description: "";
  };
  attributes: {
    backgroundColor: Attribute.Enumeration<
      ["default", "white", "blue", "yellow"]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
    paddingTop: Attribute.Enumeration<
      [
        "default",
        "px0",
        "px8",
        "px16",
        "px24",
        "px32",
        "px40",
        "px48",
        "px56",
        "px64",
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
    paddingBottom: Attribute.Enumeration<
      [
        "default",
        "px0",
        "px8",
        "px16",
        "px24",
        "px32",
        "px40",
        "px48",
        "px56",
        "px64",
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<"default">;
  };
}

export interface PageBoxWithImage extends Schema.Component {
  collectionName: "components_page_box_with_images";
  info: {
    displayName: "BoxWithImage";
    description: "";
  };
  attributes: {
    identifier: Attribute.String;
    heading: Attribute.Component<"basic.heading">;
    content: Attribute.RichText;
    image: Attribute.Media & Attribute.Required;
    container: Attribute.Component<"meta.container"> & Attribute.Required;
    outerBackground: Attribute.Component<"meta.background">;
    imageLabel: Attribute.String;
  };
}

export interface PageBox extends Schema.Component {
  collectionName: "components_page_boxes";
  info: {
    displayName: "Box";
    description: "";
  };
  attributes: {
    identifier: Attribute.String;
    label: Attribute.Component<"basic.heading">;
    heading: Attribute.Component<"basic.heading">;
    content: Attribute.Component<"basic.paragraph">;
    container: Attribute.Component<"meta.container"> & Attribute.Required;
    outerBackground: Attribute.Component<"meta.background">;
    buttons: Attribute.Component<"form-elements.button", true>;
  };
}

export interface PageHeader extends Schema.Component {
  collectionName: "components_page_headers";
  info: {
    displayName: "Header";
    description: "";
  };
  attributes: {
    heading: Attribute.Component<"basic.heading"> & Attribute.Required;
    content: Attribute.Component<"basic.paragraph">;
    container: Attribute.Component<"meta.container"> & Attribute.Required;
    outerBackground: Attribute.Component<"meta.background">;
  };
}

export interface PageInfoBoxItem extends Schema.Component {
  collectionName: "components_page_info_box_items";
  info: {
    displayName: "InfoBoxItem";
    description: "";
  };
  attributes: {
    identifier: Attribute.String;
    label: Attribute.Component<"basic.heading">;
    image: Attribute.Media;
    content: Attribute.RichText;
    headline: Attribute.Component<"basic.heading">;
    buttons: Attribute.Component<"form-elements.button", true>;
  };
}

export interface PageInfoBox extends Schema.Component {
  collectionName: "components_page_info_boxes";
  info: {
    displayName: "InfoBox";
    description: "";
  };
  attributes: {
    identifier: Attribute.String;
    heading: Attribute.Component<"basic.heading">;
    items: Attribute.Component<"page.info-box-item", true>;
    container: Attribute.Component<"meta.container"> & Attribute.Required;
    outerBackground: Attribute.Component<"meta.background">;
  };
}

export interface PageLinkListBox extends Schema.Component {
  collectionName: "components_page_link_list_boxes";
  info: {
    displayName: "LinkListBox";
    description: "";
  };
  attributes: {
    identifier: Attribute.String;
    label: Attribute.Component<"basic.heading">;
    heading: Attribute.Component<"basic.heading">;
    links: Attribute.Component<"basic.link", true>;
    container: Attribute.Component<"meta.container"> & Attribute.Required;
    outerBackground: Attribute.Component<"meta.background">;
    buttons: Attribute.Component<"form-elements.button", true>;
  };
}

export interface PageMetaPageInfo extends Schema.Component {
  collectionName: "components_page_meta_page_infos";
  info: {
    displayName: "MetaPageInfo";
    description: "";
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    ogTitle: Attribute.Text;
  };
}

export interface PageNavigationItem extends Schema.Component {
  collectionName: "components_page_navigation_items";
  info: {
    displayName: "Navigation Item";
    description: "";
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    targeturl: Attribute.String;
    baseurl: Attribute.String;
  };
}

declare module "@strapi/types" {
  export module Shared {
    export interface Components {
      "basic.heading": BasicHeading;
      "basic.link": BasicLink;
      "basic.paragraph": BasicParagraph;
      "form-elements.button": FormElementsButton;
      "form-elements.dropdown": FormElementsDropdown;
      "form-elements.input": FormElementsInput;
      "form-elements.select": FormElementsSelect;
      "form-helper.errors": FormHelperErrors;
      "form-helper.select-option": FormHelperSelectOption;
      "meta.background": MetaBackground;
      "meta.container": MetaContainer;
      "page.box-with-image": PageBoxWithImage;
      "page.box": PageBox;
      "page.header": PageHeader;
      "page.info-box-item": PageInfoBoxItem;
      "page.info-box": PageInfoBox;
      "page.link-list-box": PageLinkListBox;
      "page.meta-page-info": PageMetaPageInfo;
      "page.navigation-item": PageNavigationItem;
    }
  }
}
