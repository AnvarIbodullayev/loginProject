$(document).ready(() => {
	$('.killer').on('click', (e) => {
		$target = $(e.target);
		const id = $target.attr('data-id');
		$.ajax({
			type: 'DELETE',
			url: '/music/'+id,
			success: (response) => {
				alert('Musiqa o\'chirildi');
				window.location.href="/";
			},
			error: (err) => {
				console.log(err);
			}
		});
	});
});