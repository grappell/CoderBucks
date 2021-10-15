<script> 
    import { goto, stores } from '@sapper/app';
    import { getTeacherSubCollections } from '../../../../../db';
    import {onMount} from "svelte"
    import { ListGroup, ListGroupItem, Row, Col } from "sveltestrap/src"
    import Product from "../../../../../components/product.svelte"
	const { page } = stores();

    $: capitalTeacherName = $page.params.teacherName.charAt(0).toUpperCase() + $page.params.teacherName.substring(1)

    var studentList = []
    var productSuperList = []
    onMount(async () => {
        studentList = await getTeacherSubCollections($page.params.orgName, $page.params.teacherName, "students")
        productSuperList = chunk(3, await getTeacherSubCollections($page.params.orgName, $page.params.teacherName, "products"))
    })

    function chunk (chunkSize, list) {
        var R = [];
        for (var i = 0; i < list.length; i += chunkSize)
            R.push(list.slice(i, i + chunkSize));
        return R;
    }
</script>

<h2> {capitalTeacherName}'s Homepage </h2>
<br>

<ListGroup>
    <h4> Students:</h4>
    {#each studentList as student}
    <h4>{student.name}</h4> 
    <ListGroupItem tag="button"> {student.name}</ListGroupItem>
    {/each}
</ListGroup>

<ListGroup>
    <h4> Products:</h4>
    
</ListGroup>

{#each productSuperList as productList}
    <Row>
        {#each productList as product}
            <Col md="4">
                <Product {product}></Product>
            </Col>
        {/each}
    </Row>
{/each}