--https://create.roblox.com/docs/luau/tables#deep-clones

local function deepCopy(original)
	-- Define the new table for the copy
	local copy = {}

	-- Loop through the original table to clone
	for key, value in original do
		-- If the type of the value is a table, deep copy it to the key (index)
		-- Else (or) the type isn't a table, assign the default value to the index instead
		copy[key] = type(value) == "table" and deepCopy(value) or value
	end

	-- Return the finalized copy of the deep cloned table
	return copy
end

return {
	default = deepCopy,
	deepCopy = deepCopy,
}
