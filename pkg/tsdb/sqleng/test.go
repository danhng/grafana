package sqleng

import (
	"fmt"
	"regexp"
)

func main() {
	data := make(map[string](map[int][]string))
	data["metric"] = map[int][]string{1: {"img", "url1"}}
	// fmt.Println(data)
	reg, _ := regexp.Compile("#thumb#:(?P<thumbType>img|vid):(?P<columnName>.+)")
	var s = "#thumb#:img:1"
	fmt.Println(findNamedMatches(reg, s))
	fmt.Println(findNamedMatches(reg, s)["columnName"] != "")
}

func findNamedMatches(regex *regexp.Regexp, str string) map[string]string {
	match := regex.FindStringSubmatch(str)

	results := map[string]string{}
	for i, name := range match {
		results[regex.SubexpNames()[i]] = name
	}
	return results
}
