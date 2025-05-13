import { useState, useEffect, useRef } from "react";
import { CheckBox, FontAwesome, Text, TextInput } from "@/components/Themed";
import { List, ListItem, Divider, Card } from "@ui-kitten/components";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import _ from "lodash";

type Item = {
  key: string;
  label: string;
  selectable?: boolean;
  parentKey?: string;
  items?: Item[];
};

type TreeComponentProps = {
  data: Item[];
  style?: ViewStyle;
  onSelectionChange?: (selectedKeys: string[]) => void;
};

export default function TreeComponent({
  data,
  onSelectionChange,
  style = {},
}: TreeComponentProps) {
  const [_data, set_data] = useState<Item[]>([]);
  const assignParentKeys = (items: Item[], parentKey?: string) => {
    return items.map((item) => {
      const newItem = { ...item, parentKey };
      if (newItem.items) {
        newItem.items = assignParentKeys(newItem.items, newItem.key);
      }
      return newItem;
    });
  };
  useEffect(() => {
    const newData = assignParentKeys(_.cloneDeep(data));
    set_data(newData);
  }, [data]);

  const [searchText, setSearchText] = useState("");
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (key: string) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const toggleSelection = (key: string) => {
    setSelectedItems((prevState) => {
      const newState = {
        ...prevState,
        [key]: !prevState[key],
      };
      if (onSelectionChange) {
        const selectedKeys = Object.keys(newState).filter((k) => newState[k]);
        onSelectionChange(selectedKeys);
      }
      return newState;
    });
  };

  const renderItem = ({ item }: any) => {
    const isExpanded = !!expandedItems[item.key];
    const isSelected = !!selectedItems[item.key];
    const hasChildren = item.items && item.items.length > 0;

    return (
      <View style={styles.card}>
        <View style={styles.itemRow}>
          {hasChildren ? (
            <TouchableOpacity onPress={() => toggleExpand(item.key)}>
              <FontAwesome
                name={isExpanded ? "arrow-down" : "arrow-right"}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          ) : (
            <FontAwesome
              name="circle"
              style={[/* styles.arrowIcon, */ { opacity: 0 }]}
            />
          )}

          {item.selectable ? (
            <CheckBox
              checked={isSelected}
              onChange={() => toggleSelection(item.key)}
            >
              {item.label}
            </CheckBox>
          ) : (
            <Text>{item.label}</Text>
          )}
        </View>
        {isExpanded && hasChildren && (
          <View style={styles.nestedContainer}>{renderList(item.items)}</View>
        )}
      </View>
    );
  };

  const filterTree = (
    items: Item[],
    text: string,
    expandedState: { [key: string]: boolean }
  ): Item[] => {
    let filtered: Item[] = [];
    for (const item of items) {
      const isMatch = item.label.toLowerCase().includes(text.toLowerCase());
      const filteredChildren = item.items
        ? filterTree(item.items, text, expandedState)
        : [];

      if (isMatch) {
        // If the current node matches, include it with its original children.
        // The node itself will be collapsed by default.
        filtered.push(item);
        expandedState[item.key] = false;
      } else if (filteredChildren.length > 0) {
        // If the node doesn't match but some of its children do,
        // include the node with the filtered children and expand it.
        filtered.push({ ...item, items: filteredChildren });
        expandedState[item.key] = true;
      }
      // Nodes that don't match and have no matching descendants are skipped.
    }
    return filtered;
  };

  const filterData = (text: string) => {
    if (!text) {
      // No search text: reset to full tree and collapse everything.
      set_data(assignParentKeys(_.cloneDeep(data)));
      setExpandedItems({});
      return;
    }

    const newExpandedState: { [key: string]: boolean } = {};
    const filteredData = filterTree(data, text, newExpandedState);
    set_data(filteredData);
    setExpandedItems(newExpandedState);
  };

  const renderList = (listData: any[]) => {
    return (
      <List
        style={{ backgroundColor: "transparent", borderLeftWidth: 1 }}
        data={listData}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    );
  };

  // ========================
  // Utility functions to collect keys recursively from the current (filtered) data.
  // ========================
  const getSelectableKeys = (items: Item[]): string[] => {
    let keys: string[] = [];
    items.forEach((item) => {
      if (item.selectable) {
        keys.push(item.key);
      }
      if (item.items && item.items.length > 0) {
        keys = keys.concat(getSelectableKeys(item.items));
      }
    });
    return keys;
  };

  const getExpandableKeys = (items: Item[]): string[] => {
    let keys: string[] = [];
    items.forEach((item) => {
      if (item.items && item.items.length > 0) {
        keys.push(item.key);
        keys = keys.concat(getExpandableKeys(item.items));
      }
    });
    return keys;
  };

  // Calculate Select All state based on visible/selectable items
  const selectableKeys = getSelectableKeys(_data);
  const totalSelectable = selectableKeys.length;
  const selectedCount = selectableKeys.filter(
    (key) => selectedItems[key]
  ).length;
  const selectAllChecked =
    totalSelectable > 0 && selectedCount === totalSelectable;
  const selectAllIndeterminate =
    selectedCount > 0 && selectedCount < totalSelectable;

  // Calculate Expand All state based on visible/expandable items
  const expandableKeys = getExpandableKeys(_data);
  const totalExpandable = expandableKeys.length;
  const expandedCount = expandableKeys.filter(
    (key) => expandedItems[key]
  ).length;
  const expandAllChecked =
    totalExpandable > 0 && expandedCount === totalExpandable;
  const expandAllIndeterminate =
    expandedCount > 0 && expandedCount < totalExpandable;

  // Handler for the "Select All" checkbox.
  const toggleSelectAll = () => {
    const shouldSelectAll = !selectAllChecked; // if not all selected, then select all; otherwise, deselect all.
    if (shouldSelectAll) {
      toggleExpandAll(true);
    }
    const newSelectedItems = { ...selectedItems };
    selectableKeys.forEach((key) => {
      newSelectedItems[key] = shouldSelectAll;
    });
    setSelectedItems(newSelectedItems);
    if (onSelectionChange) {
      const selectedKeys = Object.keys(newSelectedItems).filter(
        (key) => newSelectedItems[key]
      );
      onSelectionChange(selectedKeys);
    }
  };

  // Handler for the "Expand All" checkbox.
  const toggleExpandAll = (shouldExpandAll: boolean | undefined) => {
    const _shouldExpandAll =
      shouldExpandAll != undefined ? shouldExpandAll : !expandAllChecked; // if not all expanded, then expand all; otherwise, collapse all.
    const newExpandedItems = { ...expandedItems };
    expandableKeys.forEach((key) => {
      newExpandedItems[key] = _shouldExpandAll;
    });
    setExpandedItems(newExpandedItems);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        leftIcon="search"
        placeholder="Search..."
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          filterData(text);
        }}
        style={styles.searchTextInput}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <CheckBox
          checked={expandAllChecked}
          indeterminate={expandAllIndeterminate}
          onChange={toggleExpandAll}
        >
          Expand All
        </CheckBox>
        <CheckBox
          checked={selectAllChecked}
          indeterminate={selectAllIndeterminate}
          onChange={toggleSelectAll}
        >
          Select All
        </CheckBox>
      </View>
      <View style={{ flex: 1, marginBottom: 10 }}>{renderList(_data)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    width: "100%",
  },
  searchTextInput: {
    marginBottom: 10,
  },
  treeContainer: {
    flex: 1,
  },
  card: {
    padding: 10,
    margin: 0,
    borderWidth: 0,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIcon: {
    fontSize: 18,
    marginRight: 15,
  },
  nestedContainer: {
    marginLeft: 0,
    marginTop: 5,
  },
});
