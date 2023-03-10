package repositry

import (
	"time"
	"github.com/patrickmn/go-cache"
	"local.com/protocols"
)

type RadioRepositry struct {
	cache *cache.Cache
}


func New()(*RadioRepositry) {
	pc := cache.New(cache.NoExpiration,cache.NoExpiration)
	props := []protocols.Property {
		{
			Name : "TestName1",
			ID : "Test1",
			Value : "TestValue1",
			Updateat : "2022/08/13 00:00:00",
		},
		{
			Name : "TestName2",
			ID : "Test2",
			Value: "TestValue2",
			Updateat : "2022/08/13 00:00:00",
		},
		{
			Name : "TestName3",
			ID : "Test3",
			Value: "TestValue3",
			Updateat : "2022/08/13 00:00:00",
		},
		{
			Name : "TestName4",
			ID : "Test4",
			Value: "TestValue4",
			Updateat : "2022/08/13 00:00:00",
		},
	}
	pc.Set("property",props,cache.NoExpiration)	
	return &RadioRepositry {
		cache: pc,	
	}
}

func (repos *RadioRepositry) Update(path string,datamap map[string]string) {
	props := make([]protocols.Property,len(datamap))	
	var pindex int = 0
	for k,v := range datamap {
		//props[pindex].ID = path + string(pindex+1) 
		props[pindex].ID = k 
		props[pindex].Name = k
		props[pindex].Value = v 
		props[pindex].Updateat = time.Now().Format("2006-01-02 15:04:05") 
		pindex++			
	}
	repos.cache.Set(path,props,cache.NoExpiration)	
}

func (repos *RadioRepositry) Get(path string) (interface{}) {
	data , _ := repos.cache.Get(path)
	return data	
}
